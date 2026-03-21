from fastapi import APIRouter, Request
from src.interactions.schemas import SwipeBatchRequest, SwipeBatchResponse
from src.interactions.service import process_swipe_batch

router = APIRouter()

@router.post("/swipe-batch", response_model=SwipeBatchResponse)
async def swipe_batch(request: Request, body: SwipeBatchRequest):
    """
    Nhận một batch (mảng) các thao tác vuốt từ Frontend.
    Chạy thuật toán Active Learning để cập nhật vector người dùng.
    
    Frontend sẽ gom tối đa 5 actions hoặc đợi 3 giây rồi gửi 1 lần.
    """
    redis = request.app.state.redis
    
    # Chuyển list SwipeAction thành list dict để service xử lý
    actions_data = [action.model_dump() for action in body.actions]
    
    result = await process_swipe_batch(
        redis=redis,
        user_id=body.user_id,
        domain=body.domain,
        actions=actions_data
    )
    
    return result
