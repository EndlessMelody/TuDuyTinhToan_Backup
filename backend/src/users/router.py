from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from src.db.database import get_db
from src.users.schemas import UserCreate, UserResponse
from src.users.service import UserService

router = APIRouter()


def get_user_service(
    request: Request,
    db: AsyncSession = Depends(get_db)
) -> UserService:
    """Inject cả db lẫn redis vào UserService."""
    return UserService(db=db, redis=request.app.state.redis)


@router.post(
    "/",
    response_model=UserResponse,
    summary="Đăng ký người dùng mới",
    description="Tạo tài khoản. Nếu có device_id, vector từ Redis (guest) sẽ được migrate sang Postgres."
)
async def register_user(
    user_in: UserCreate,
    service: UserService = Depends(get_user_service)
):
    return await service.create_user(user_in)


@router.get(
    "/{user_id}",
    response_model=UserResponse,
    summary="Lấy thông tin người dùng"
)
async def get_user(
    user_id: int,
    service: UserService = Depends(get_user_service)
):
    return await service.get_user_by_id(user_id)
