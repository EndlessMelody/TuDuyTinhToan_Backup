from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from src.db.database import get_db
from src.auth.schemas import LoginRequest, TokenResponse
from src.auth import service

router = APIRouter()


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Đăng nhập",
    description="Trả về access token (stub) và thông tin user."
)
async def login(
    body: LoginRequest,
    db: AsyncSession = Depends(get_db)
):
    return await service.login(body, db)


@router.post(
    "/logout",
    summary="Đăng xuất",
    description="Invalidate token (stub: luôn trả ok)."
)
async def logout(request: Request):
    redis = request.app.state.redis
    return await service.logout(user_id=0, redis=redis)
