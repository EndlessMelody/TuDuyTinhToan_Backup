from fastapi import APIRouter, Request
from src.sessions.schemas import InitSessionRequest, InitSessionResponse
from src.sessions.service import init_session

router = APIRouter()

@router.post("/init", response_model=InitSessionResponse)
async def init_user_session(request: Request, body: InitSessionRequest):
    """
    Khởi tạo phiên người dùng.
    - Nếu device_id đã có trên Redis → trả lại user_id và vector hiện tại.
    - Nếu chưa → tạo mới user_id (UUID) và vector trung lập [0.5]*8.
    """
    redis = request.app.state.redis
    result = await init_session(redis, body.device_id, body.domain)
    return result
