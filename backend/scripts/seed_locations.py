"""
ETL Pipeline: seed_locations.py
────────────────────────────────
Populate bảng `locations` bằng cách:
  1. EXTRACT  → OpenStreetMap Overpass API (miễn phí, không cần API key)
  2. TRANSFORM → Gemini LLM chấm điểm 15 latent features → vector + characteristics
  3. LOAD      → Insert vào PostgreSQL qua SQLAlchemy async

Chạy từ thư mục backend/:
    .\.venv\Scripts\python.exe scripts\seed_locations.py

Chỉ cần thêm vào .env:
    GEMINI_API_KEY=<your_key>   ← lấy miễn phí tại aistudio.google.com
"""

import asyncio
import json
import logging
import os
import sys
import urllib.parse
from typing import Any

import httpx
from dotenv import load_dotenv
from sqlalchemy import select

# ── Đưa thư mục backend vào sys.path để import được namespace `src` ──
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

load_dotenv()  # đọc .env trong cùng thư mục backend/

from src.db.database import AsyncSessionLocal
from src.locations.models import Location

# ══════════════════════════════════════════════════════════════════════
#  CONFIGURATION
# ══════════════════════════════════════════════════════════════════════

GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

# 15 latent features — ĐÚNG THỨ TỰ, không được đổi
LATENT_FEATURES: list[str] = [
    "spicy",
    "sweet",
    "salty",
    "street_food",
    "luxury",
    "chill_vibe",
    "crowded",
    "romantic",
    "family_friendly",
    "late_night",
    "quick_bite",
    "healthy",
    "photogenic",
    "loud_music",
    "local_favorite",
]

# ── Định nghĩa các vùng cần ETL ──────────────────────────────────────
# Mỗi entry là một bounding box: (south, west, north, east)
# và nhãn khu vực để log. Thêm/bớt tuỳ ý.
# Gợi ý: dùng https://boundingbox.klokantech.com để vẽ bbox
SEARCH_AREAS: list[dict[str, Any]] = [
    {
        "label": "Khu vực Bãi Trước - Bãi Sau, Vũng Tàu",
        # Bbox bao trọn mũi Vũng Tàu (Từ Tượng Chúa Kito đến Quảng trường)
        "bbox": (10.335, 107.065, 10.365, 107.105),
        "amenities": [
            "restaurant", "cafe", "fast_food", "food_court", 
            "bar", "pub", "biergarten", "ice_cream", "bakery"
        ],
    }

    # {
    #     "label": "Làng Đại Học Thủ Đức, HCM",
    #     # bbox bao quanh khu Làng ĐH Thủ Đức & khu vực lân cận
    #     "bbox": (10.840, 106.760, 10.885, 106.810),
    #     # OSM amenity tags cần lấy
    #     "amenities": ["restaurant", "cafe", "fast_food", "food_court", "bar"],
    # },
    # {
    #     "label": "Quận 1, HCM",
    #     "bbox": (10.765, 106.690, 10.790, 106.710),
    #     "amenities": ["restaurant", "cafe", "fast_food"],
    # },
    # {
    #     "label": "Quận 3, HCM",
    #     "bbox": (10.773, 106.676, 10.793, 106.693),
    #     "amenities": ["restaurant", "cafe", "bar"],
    # },
]

# Số địa điểm tối đa lấy từ OSM cho mỗi khu vực
MAX_RESULTS_PER_AREA = 100

# Overpass API endpoint (có thể đổi sang mirror khác nếu chậm)
OVERPASS_URL = "https://overpass-api.de/api/interpreter"

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
log = logging.getLogger(__name__)


# ══════════════════════════════════════════════════════════════════════
#  STEP 1: EXTRACT — OpenStreetMap Overpass API
# ══════════════════════════════════════════════════════════════════════

def _build_overpass_query(bbox: tuple[float, float, float, float], amenities: list[str]) -> str:
    """
    Xây dựng Overpass QL query để lấy node/way có amenity tag trong bbox.

    bbox format: (south, west, north, east)
    Output: chuỗi QL gửi lên Overpass API.
    """
    s, w, n, e = bbox
    bbox_str = f"{s},{w},{n},{e}"

    # Build union của nhiều amenity tags
    union_parts = []
    for amenity in amenities:
        union_parts.append(f'  node["amenity"="{amenity}"]({bbox_str});')
        union_parts.append(f'  way["amenity"="{amenity}"]({bbox_str});')

    union_block = "\n".join(union_parts)

    return f"""[out:json][timeout:30];
(
{union_block}
);
out center {MAX_RESULTS_PER_AREA};"""


async def fetch_osm_places(
    area: dict[str, Any], client: httpx.AsyncClient
) -> list[dict[str, Any]]:
    """
    Gọi Overpass API, trả về danh sách element OSM (node/way) thô.
    Không cần API key, hoàn toàn miễn phí.
    """
    query = _build_overpass_query(area["bbox"], area["amenities"])
    log.info(f"[EXTRACT] Gọi Overpass API cho khu vực: '{area['label']}'")

    # Overpass nhận POST với body là query string (không phải JSON)
    resp = await client.post(
        OVERPASS_URL,
        data={"data": query},
        timeout=35,
        headers={"User-Agent": "TasteMap-ETL/1.0"},
    )
    resp.raise_for_status()
    data = resp.json()
    elements = data.get("elements", [])
    log.info(f"[EXTRACT] OSM trả về {len(elements)} elements.")
    return elements


def parse_osm_element(elem: dict[str, Any], city: str) -> dict[str, Any] | None:
    """
    Parse một OSM element (node hoặc way) thành dict chuẩn cho ETL.
    Trả về None nếu thiếu tên hoặc tọa độ.
    """
    tags: dict[str, str] = elem.get("tags", {})
    name: str = tags.get("name") or tags.get("name:vi") or tags.get("name:en", "")

    if not name:
        return None  # bỏ qua địa điểm không có tên

    # Tọa độ: node có lat/lon trực tiếp; way có "center"
    if elem["type"] == "node":
        lat = float(elem.get("lat", 0))
        lng = float(elem.get("lon", 0))
    elif elem["type"] == "way":
        center = elem.get("center", {})
        lat = float(center.get("lat", 0))
        lng = float(center.get("lon", 0))
    else:
        return None

    if lat == 0 and lng == 0:
        return None

    # Ghép địa chỉ từ các tag OSM có sẵn
    addr_parts = [
        tags.get("addr:housenumber", ""),
        tags.get("addr:street", ""),
        tags.get("addr:suburb", ""),
        tags.get("addr:city", city),
    ]
    address = ", ".join(p for p in addr_parts if p).strip(", ")
    if not address:
        address = city  # fallback

    # OSM không có rating → để 0, LLM sẽ bù đắp qua characteristics
    rating = 0.0

    # Giờ mở cửa từ tag opening_hours của OSM
    open_hours: str = tags.get("opening_hours", "Chưa rõ")

    # Xác định category dựa trên amenity tag
    amenity = tags.get("amenity", "restaurant")
    category = "food" if amenity in (
        "restaurant", "cafe", "fast_food", "food_court", "bar", "pub", "ice_cream"
    ) else "place"

    # Thông tin bổ sung để làm giàu context cho LLM
    cuisine: str = tags.get("cuisine", "")
    description: str = tags.get("description", "")
    # OSM không có review → xây dựng "pseudo-context" từ tags để LLM suy luận tốt hơn
    osm_context: list[str] = []
    if cuisine:
        osm_context.append(f"Ẩm thực: {cuisine}")
    if description:
        osm_context.append(f"Mô tả: {description}")
    if open_hours != "Chưa rõ":
        osm_context.append(f"Giờ mở cửa: {open_hours}")
    if tags.get("outdoor_seating"):
        osm_context.append("Có chỗ ngồi ngoài trời")
    if tags.get("wheelchair") == "yes":
        osm_context.append("Có lối vào cho xe lăn")
    if tags.get("delivery") == "yes":
        osm_context.append("Hỗ trợ giao hàng")
    if tags.get("takeaway") == "yes":
        osm_context.append("Có bán mang về")

    return {
        "name": name,
        "lat": lat,
        "lng": lng,
        "address": address,
        "city": city,
        "rating": rating,
        "open_hours": open_hours,
        "category": category,
        # Dùng osm_context thay cho reviews (OSM không có review)
        "osm_context": osm_context,
    }


# ══════════════════════════════════════════════════════════════════════
#  STEP 2: TRANSFORM — Gemini LLM → vector 15 chiều
# ══════════════════════════════════════════════════════════════════════

def _build_llm_prompt(name: str, category: str, osm_context: list[str]) -> str:
    """
    Xây dựng prompt cho Gemini. Vì OSM không có reviews,
    dùng thông tin tags (cuisine, opening_hours, ...) + tên để LLM suy luận.
    """
    features_str = json.dumps(LATENT_FEATURES, ensure_ascii=False)
    context_str = (
        "\n".join(f"- {c}" for c in osm_context)
        if osm_context
        else "- (Chỉ có tên địa điểm, không có thông tin bổ sung)"
    )

    return f"""Bạn là một chuyên gia phân tích địa điểm ẩm thực và du lịch tại Việt Nam.

Địa điểm: **{name}**  
Loại: {category}

Thông tin từ OpenStreetMap:
{context_str}

Nhiệm vụ: Dựa vào tên và thông tin trên, hãy **ước tính** điểm số cho địa điểm này trên **15 tiêu chí** sau theo thang từ **0.0 (hoàn toàn không) đến 1.0 (rất đặc trưng)**:
{features_str}

Hướng dẫn:
- Suy luận hợp lý từ tên và thể loại ẩm thực nếu thiếu thông tin.
- Ví dụ: "Cháo lòng" → spicy cao, street_food cao, local_favorite cao; "La Viet Coffee" → chill_vibe cao, photogenic cao.
- Chỉ trả về một JSON object hợp lệ với đúng 15 key ở trên.
- Không giải thích, không markdown, chỉ JSON thuần túy.

Ví dụ output:
{{"spicy": 0.8, "sweet": 0.2, "salty": 0.6, "street_food": 0.9, "luxury": 0.0, "chill_vibe": 0.3, "crowded": 0.7, "romantic": 0.1, "family_friendly": 0.6, "late_night": 0.4, "quick_bite": 0.8, "healthy": 0.2, "photogenic": 0.3, "loud_music": 0.5, "local_favorite": 0.9}}"""


async def transform_with_llm(
    name: str,
    category: str,
    osm_context: list[str],
    client: httpx.AsyncClient,
) -> tuple[dict[str, float], list[float]]:
    """
    Gọi Gemini REST API → sinh characteristics (dict) và vector (list[float]).
    Vector shape: (15,) — đúng thứ tự LATENT_FEATURES
    Fallback về 0.5 nếu LLM lỗi (graceful degradation).
    """
    prompt = _build_llm_prompt(name, category, osm_context)

    gemini_url = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"
    )
    body = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.2,      # thấp → deterministic, ít hallucinate
            "maxOutputTokens": 512,
        },
    }

    log.info(f"[TRANSFORM] Gọi Gemini LLM cho: '{name}'")
    try:
        resp = await client.post(gemini_url, json=body, timeout=30)
        resp.raise_for_status()
        result = resp.json()

        raw_text: str = (
            result["candidates"][0]["content"]["parts"][0]["text"].strip()
        )

        # Strip markdown code fences nếu Gemini trả về ```json ... ```
        if raw_text.startswith("```"):
            raw_text = raw_text.split("```")[1]
            if raw_text.startswith("json"):
                raw_text = raw_text[4:]
        raw_text = raw_text.strip()

        characteristics: dict[str, float] = json.loads(raw_text)

        # Đảm bảo đủ 15 key và clamp giá trị về [0.0, 1.0]
        for feat in LATENT_FEATURES:
            val = float(characteristics.get(feat, 0.5))
            characteristics[feat] = round(max(0.0, min(1.0, val)), 3)

        # Vector 15 chiều — đúng thứ tự LATENT_FEATURES
        # Shape: (15,) → pgvector nhận list[float]
        vector: list[float] = [characteristics[feat] for feat in LATENT_FEATURES]

        log.info(f"[TRANSFORM] ✅ OK: '{name}'")
        return characteristics, vector

    except Exception as exc:
        log.warning(f"[TRANSFORM] ⚠️  LLM lỗi cho '{name}': {exc} → fallback 0.5")
        fallback: dict[str, float] = {feat: 0.5 for feat in LATENT_FEATURES}
        return fallback, [0.5] * 15


# ══════════════════════════════════════════════════════════════════════
#  STEP 3: LOAD — Insert vào PostgreSQL
# ══════════════════════════════════════════════════════════════════════

async def load_location(session, place: dict[str, Any]) -> bool:
    """
    Insert một location vào DB. Skip nếu tên đã tồn tại (idempotent).
    Trả về True nếu insert thành công, False nếu skip.
    """
    stmt = select(Location).where(Location.name == place["name"])
    result = await session.execute(stmt)
    if result.scalars().first():
        log.info(f"[LOAD] ⏭️  Skip (đã tồn tại): '{place['name']}'")
        return False

    # Rating OSM = 0 → base_score = 0. Để tự nhiên, không normalize.
    # Khi có review thực từ user app sẽ update dần qua interaction vector.
    location = Location(
        name=place["name"],
        lat=place["lat"],
        lng=place["lng"],
        address=place["address"],
        city=place["city"],
        category=place["category"],
        price_range="N/A",
        open_hours=place["open_hours"],
        rating=place["rating"],
        base_score=0.0,
        characteristics=place["characteristics"],
        vector=place["vector"],
    )
    session.add(location)
    log.info(f"[LOAD] ✅ Thêm: '{place['name']}' ({place['category']})")
    return True


# ══════════════════════════════════════════════════════════════════════
#  MAIN PIPELINE
# ══════════════════════════════════════════════════════════════════════

async def run_pipeline() -> None:
    if not GEMINI_API_KEY:
        log.error("❌ Thiếu GEMINI_API_KEY trong .env — lấy miễn phí tại aistudio.google.com")
        return

    inserted_count = 0
    skipped_count = 0
    error_count = 0

    # httpx timeout tổng thể: connect=10s, read=35s (Overpass đôi khi chậm)
    timeout = httpx.Timeout(connect=10.0, read=35.0, write=10.0, pool=5.0)

    async with httpx.AsyncClient(timeout=timeout) as http_client:
        async with AsyncSessionLocal() as db_session:

            for area in SEARCH_AREAS:
                log.info(f"\n{'='*60}")
                log.info(f"[PIPELINE] Khu vực: '{area['label']}'")
                log.info(f"{'='*60}")

                # ── EXTRACT ──────────────────────────────────────────
                try:
                    elements = await fetch_osm_places(area, http_client)
                except Exception as exc:
                    log.error(f"[EXTRACT] ❌ Lỗi Overpass API: {exc}")
                    error_count += 1
                    continue

                city_label: str = area["label"].split(",")[-1].strip()

                for elem in elements:
                    parsed = parse_osm_element(elem, city_label)
                    if not parsed:
                        continue  # skip element không có tên/tọa độ

                    # ── TRANSFORM ─────────────────────────────────────
                    try:
                        # Gemini Free Tier bị giới hạn 15 Request / Phút
                        # Phải sleep 4.5s để không bị dính lỗi 429 Too Many Requests
                        log.info(f"⏳ Đang đợi 4.5s để tránh vượt giới hạn API Gemini (Rate Limit)...")
                        await asyncio.sleep(4.5)
                        
                        characteristics, vector = await transform_with_llm(
                            name=parsed["name"],
                            category=parsed["category"],
                            osm_context=parsed["osm_context"],
                            client=http_client,
                        )
                    except Exception as exc:
                        log.error(f"[TRANSFORM] ❌ Lỗi không mong đợi cho '{parsed['name']}': {exc}")
                        error_count += 1
                        continue

                    parsed["characteristics"] = characteristics
                    parsed["vector"] = vector

                    # ── LOAD ───────────────────────────────────────────
                    try:
                        ok = await load_location(db_session, parsed)
                        if ok:
                            await db_session.commit()
                            inserted_count += 1
                        else:
                            skipped_count += 1
                    except Exception as exc:
                        log.error(f"[LOAD] ❌ Lỗi insert '{parsed['name']}': {exc}")
                        await db_session.rollback()
                        error_count += 1

    log.info("\n" + "=" * 60)
    log.info("[PIPELINE] Hoàn tất!")
    log.info(f"  ✅ Inserted : {inserted_count}")
    log.info(f"  ⏭️  Skipped  : {skipped_count}")
    log.info(f"  ❌ Errors   : {error_count}")
    log.info("=" * 60)


if __name__ == "__main__":
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(run_pipeline())
