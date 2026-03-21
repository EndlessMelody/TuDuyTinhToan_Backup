from fastapi import APIRouter
from src.feed.schemas import FeedResponse
from src.feed.service import get_feed_cards

router = APIRouter()

@router.get("/cards", response_model=FeedResponse)
async def get_cards(
    user_id: str = "",
    type: str = "place",
    limit: int = 10
):
    """
    Lấy danh sách thẻ để Frontend render (Batch Fetching).
    - user_id: ID người dùng (dùng để lọc thẻ đã xem sau này)
    - type: "food" hoặc "place"
    - limit: số lượng thẻ muốn lấy (mặc định 10)
    
    Response KHÔNG chứa vector — Frontend chỉ cần thông tin hiển thị.
    """
    cards = get_feed_cards(feed_type=type, limit=limit)
    return {"cards": cards}
