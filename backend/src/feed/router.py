from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from src.db.database import get_db
from src.feed.schemas import FeedResponse
from src.feed.service import get_feed_cards
from typing import Optional

router = APIRouter()


@router.get(
    "/cards",
    response_model=FeedResponse,
    summary="Lấy thẻ swipe (Tinder-style)",
    description="Trả kèm photos và reviews_preview để hỗ trợ Flip Card UI mà không cần gọi thêm API."
)
async def get_cards(
    user_id: Optional[str] = Query(None),
    category: str = Query("place", description="'food' hoặc 'place'"),
    lat: Optional[float] = Query(None, description="Tọa độ user — backend tính distance_km ở tầng DB"),
    lng: Optional[float] = Query(None),
    limit: int = Query(10, ge=1, le=50),
    db: AsyncSession = Depends(get_db)
):
    cards = await get_feed_cards(db=db, user_id=user_id, category=category, limit=limit, lat=lat, lng=lng)
    return {"cards": cards}
