"""
Feed Service — Tinder-style swipe cards with Flip Card support.

RULE: Distance calculation happens entirely in the DB using a SQLAlchemy
Haversine approximation, NOT in a Python loop:
    dist_km ≈ sqrt( (Δlat * 111)^2 + (Δlng * 111 * cos(lat_rad))^2 )

This avoids loading thousands of rows into Python memory.
"""
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func, text
from sqlalchemy.sql.expression import literal

from src.locations.models import Location
from src.posts.models import Post


# Radius of Earth in km used for Haversine: 1 degree lat ≈ 111 km

def _haversine_distance_column(user_lat: float, user_lng: float):
    """
    Build a SQLAlchemy column expression for approximate Haversine distance.
    Formula: sqrt( (Δlat*111)^2 + (Δlng*111*cos(lat_rad))^2 )
    No PostGIS required — uses standard Postgres math functions.
    """
    delta_lat = Location.lat - user_lat
    delta_lng = Location.lng - user_lng
    lat_rad = func.radians(Location.lat)
    dist_sq = (
        func.pow(delta_lat * 111.0, 2)
        + func.pow(delta_lng * 111.0 * func.cos(lat_rad), 2)
    )
    return func.sqrt(dist_sq)


async def get_feed_cards(
    db: AsyncSession,
    user_id: Optional[str] = None,
    category: str = "place",
    limit: int = 10,
    lat: Optional[float] = None,
    lng: Optional[float] = None,
) -> List[dict]:
    """
    Lấy batch thẻ để Frontend render.
    - Nếu có lat/lng: tính distance_km trong DB (Haversine), sắp xếp gần trước.
    - Nếu không có lat/lng: random order, distance_km = null.
    - Trả về photos và reviews_preview để flip card không cần gọi thêm API.
    """
    if lat is not None and lng is not None:
        dist_col = _haversine_distance_column(lat, lng).label("distance_km")
        query = (
            select(Location, dist_col)
            .where(Location.category == category)
            .order_by(dist_col)
            .limit(limit)
        )
        result = await db.execute(query)
        rows = result.all()

        cards = []
        for row in rows:
            loc, distance_km = row
            reviews = await _get_reviews_preview(db, loc.id)
            cards.append(_build_card(loc, distance_km=round(float(distance_km), 2), reviews=reviews))
    else:
        query = (
            select(Location)
            .where(Location.category == category)
            .order_by(func.random())
            .limit(limit)
        )
        result = await db.execute(query)
        locations = result.scalars().all()

        cards = []
        for loc in locations:
            reviews = await _get_reviews_preview(db, loc.id)
            cards.append(_build_card(loc, distance_km=None, reviews=reviews))

    return cards


async def _get_reviews_preview(db: AsyncSession, location_id: int) -> List[str]:
    """Lấy 2 câu review ngắn nhất của địa điểm để phục vụ flip card."""
    result = await db.execute(
        select(Post.review)
        .where(Post.location_id == location_id)
        .order_by(Post.likes_count.desc())
        .limit(2)
    )
    rows = result.all()
    # Truncate each review to 120 chars for preview
    return [row[0][:120] for row in rows if row[0]]


def _build_card(loc: Location, distance_km: Optional[float], reviews: List[str]) -> dict:
    return {
        "id": loc.id,
        "name": loc.name,
        "image_url": loc.image_url or "",
        "tags": [],  # Will be derived from characteristics in the future
        "price_range": loc.price_range,
        "rating": loc.rating,
        "distance_km": distance_km,
        "match_percent": None,  # Requires user vector — set by recommendations layer
        "photos": [loc.image_url] if loc.image_url else [],
        "reviews_preview": reviews,
    }
