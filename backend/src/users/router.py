from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from src.db.database import get_db
from src.users.schemas import UserCreate, UserResponse, UserProfile, UserMe, UserUpdate, TopSpotResponse
from src.users.service import UserService
from src.core.dependencies import get_current_user_id
from typing import List

router = APIRouter()


def get_user_service(request: Request, db: AsyncSession = Depends(get_db)) -> UserService:
    return UserService(db=db, redis=request.app.state.redis)

@router.post(
    "/",
    response_model=UserResponse,
    summary="Đăng ký người dùng mới",
    description="Tạo tài khoản. Nếu có device_id, vector từ Redis (guest) sẽ được migrate sang Postgres."
)
async def register_user(user_in: UserCreate, service: UserService = Depends(get_user_service)):
    return await service.create_user(user_in)


@router.get(
    "/me",
    response_model=UserMe,
    summary="Lấy thông tin cá nhân (bao gồm private fields)",
    description="Yêu cầu header X-User-ID."
)
async def get_me(
    user_id: int = Depends(get_current_user_id),
    service: UserService = Depends(get_user_service)
):
    return await service.get_me(user_id)


@router.patch(
    "/me",
    response_model=UserMe,
    summary="Cập nhật profile",
    description="Chỉ gửi fields cần thay đổi."
)
async def update_me(
    body: UserUpdate,
    user_id: int = Depends(get_current_user_id),
    service: UserService = Depends(get_user_service)
):
    return await service.update_me(user_id, body)


@router.get(
    "/{user_id}",
    response_model=UserProfile,
    summary="Lấy public profile người dùng"
)
async def get_user(user_id: int, service: UserService = Depends(get_user_service)):
    return await service.get_profile(user_id)


@router.get(
    "/{user_id}/top-spots",
    response_model=List[TopSpotResponse],
    summary="Top địa điểm yêu thích nhất của user"
)
async def get_top_spots(user_id: int, limit: int = 3, service: UserService = Depends(get_user_service)):
    return await service.get_top_spots(user_id, limit)
