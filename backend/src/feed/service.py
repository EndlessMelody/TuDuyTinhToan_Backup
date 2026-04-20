"""
Feed Service — Tinder-style swipe cards with Flip Card support.

RULE: Distance calculation happens entirely in the DB using a SQLAlchemy
Haversine approximation, NOT in a Python loop:
    dist_km ≈ sqrt( (Δlat * 111)^2 + (Δlng * 111 * cos(lat_rad))^2 )

This avoids loading thousands of rows into Python memory.
"""
import json
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func, text
from sqlalchemy.sql.expression import literal

from src.locations.models import Location
from src.posts.models import Post
from src.db.redis import RedisClient


# Radius of Earth in km used for Haversine: 1 degree lat ≈ 111 km

CACHE_TTL_SECONDS = 300  # 5 minutes cache for feed

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


import logging

logger = logging.getLogger(__name__)

async def get_feed_cards(
    db: AsyncSession,
    user_id: Optional[str] = None,
    category: str = "place",
    limit: int = 10,
    lat: Optional[float] = None,
    lng: Optional[float] = None,
    cursor: Optional[str] = None,
) -> dict:
    """
    Lấy batch thẻ để Frontend render.
    - Nếu có lat/lng: tính distance_km trong DB (Haversine), sắp xếp gần trước.
    - Nếu không có lat/lng: random order, distance_km = null.
    - Trả về photos và reviews_preview để flip card không cần gọi thêm API.
    """
    logger.info(f"[FEED] Getting cards: category={category}, limit={limit}, lat={lat}, lng={lng}")
    
    # Generate cache key
    cache_key = f"feed:{category}:{limit}:{lat}:{lng}:{user_id or 'anon'}"
    
    # Try to get from cache (skip cache if cursor is provided)
    if not cursor:
        try:
            cached = await RedisClient.get(cache_key)
            if cached:
                logger.info(f"[FEED] Cache hit for {cache_key}")
                return json.loads(cached)
        except Exception as e:
            logger.warning(f"[FEED] Redis cache error: {e}")
    
    if lat is not None and lng is not None:
        dist_col = _haversine_distance_column(lat, lng).label("distance_km")
        query = (
            select(Location, dist_col)
            .where((Location.category == category) | (Location.category.is_(None)))
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
        # Show all locations regardless of category (treat NULL as 'place')
        # Use ID-based cursor for consistent pagination
        base_query = (
            select(Location)
            .where((Location.category == category) | (Location.category.is_(None)))
        )
        
        # Apply cursor filter if provided
        if cursor:
            try:
                cursor_id = int(cursor)
                base_query = base_query.where(Location.id > cursor_id)
            except ValueError:
                logger.warning(f"[FEED] Invalid cursor: {cursor}")
        
        query = base_query.order_by(Location.id).limit(limit)
        result = await db.execute(query)
        locations = result.scalars().all()
        logger.info(f"[FEED] Query returned {len(locations)} locations for category='{category}' (including NULL)")
        for loc in locations[:5]:  # Log first 5
            logger.info(f"[FEED]   - {loc.id}: {loc.name} (cat={loc.category})")

        cards = []
        for loc in locations:
            reviews = await _get_reviews_preview(db, loc.id)
            cards.append(_build_card(loc, distance_km=None, reviews=reviews))
        
        logger.info(f"[FEED] Returning {len(cards)} cards")

    # Determine next_cursor and has_more
    next_cursor = None
    has_more = False
    if cards:
        next_cursor = str(cards[-1]["id"])
        has_more = len(cards) == limit

    result = {
        "cards": cards,
        "next_cursor": next_cursor,
        "has_more": has_more
    }

    # Cache the result
    try:
        await RedisClient.setex(cache_key, CACHE_TTL_SECONDS, json.dumps(result))
        logger.info(f"[FEED] Cached {len(cards)} cards for {cache_key}")
    except Exception as e:
        logger.warning(f"[FEED] Failed to cache: {e}")

    return result


async def _get_reviews_preview(db: AsyncSession, location_id: int) -> List[str]:
    """Lấy 2 câu review ngắn nhất của địa điểm để phục vụ flip card."""
    try:
        result = await db.execute(
            select(Post.review)
            .where(Post.location_id == location_id)
            .order_by(Post.likes_count.desc())
            .limit(2)
        )
        rows = result.all()
        # Truncate each review to 120 chars for preview
        return [row[0][:120] for row in rows if row[0]]
    except Exception as e:
        logger.warning(f"[FEED] Error getting reviews for location {location_id}: {e}")
        return []


def _build_card(loc: Location, distance_km: Optional[float], reviews: List[str]) -> dict:
    # Extract tags from characteristics if available
    tags = []
    if loc.characteristics:
        if isinstance(loc.characteristics, dict):
            # Get top 3 characteristics with highest scores
            sorted_chars = sorted(
                [(k, v) for k, v in loc.characteristics.items() if isinstance(v, (int, float))],
                key=lambda x: x[1],
                reverse=True
            )[:3]
            tags = [k.replace("_", " ").title() for k, v in sorted_chars]
    
    # Default NULL category to 'place'
    category = loc.category if loc.category else "place"
    
    return {
        "id": loc.id,
        "name": loc.name,
        "image_url": loc.image_url,  # Let frontend handle null with stock images
        "tags": tags,
        "price_range": loc.price_range,
        "rating": loc.rating,
        "distance_km": distance_km,
        "match_percent": None,  # Requires user vector — set by recommendations layer
        "photos": [loc.image_url] if loc.image_url else [],
        "reviews_preview": reviews,
        "address": loc.address,
        "open_hours": loc.open_hours,
        "category": category,  # "food" | "place" (defaults to "place" if NULL)
        "lat": loc.lat,
        "lng": loc.lng,
    }
