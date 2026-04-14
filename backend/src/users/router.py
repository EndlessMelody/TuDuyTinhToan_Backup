from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.db.database import get_db
from src.users.schemas import UserCreate, UserUpdate, UserResponse, ProfileResponse
from src.users.service import UserService, ProfileService

router = APIRouter()

def get_user_service(db: AsyncSession = Depends(get_db)) -> UserService:
    return UserService(db)

def get_profile_service(db: AsyncSession = Depends(get_db)) -> ProfileService:
    return ProfileService(db)

@router.post("/", response_model=UserResponse)
async def register_user(
    user_in: UserCreate, 
    service: UserService = Depends(get_user_service)
):
    """
    Đăng ký người dùng mới.
    - username: Tên người dùng
    - email: Email người dùng
    """
    return await service.create_user(user_in)

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int, 
    service: UserService = Depends(get_user_service)
):
    """
    Lấy thông tin người dùng.
    - user_id: ID người dùng
    """
    return await service.get_user_by_id(user_id)

@router.patch("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: int,
    user_update: UserUpdate,
    service: UserService = Depends(get_user_service)
):
    """
    Cập nhật thông tin người dùng.
    - user_id: ID người dùng
    """
    return await service.update_user(user_id, user_update)


# ═══════════════════════════════════════════════════════════
# PROFILE ENDPOINTS (cho /profile page)
# ═══════════════════════════════════════════════════════════

@router.get("/{user_id}/profile", response_model=ProfileResponse)
async def get_user_profile(
    user_id: int,
    service: ProfileService = Depends(get_profile_service)
):
    """
    Lấy full profile cho /profile page.
    
    Trả về:
    - User info (name, bio, avatar, cover, etc.)
    - Gamification (level, xp, nextLevelXp)
    - Stats (reviews, visited, followers, following)
    - Taste DNA (radar chart data từ food_vector + place_vector)
    - Badges (dựa trên level/xp)
    - Posts & Top Spots
    """
    return await service.get_profile(user_id)

@router.get("/me/profile", response_model=ProfileResponse)
async def get_my_profile(
    # TODO: Sau này lấy user_id từ JWT token
    service: ProfileService = Depends(get_profile_service)
):
    """
    Lấy profile của người dùng hiện tại (authenticated).
    
    **NOTE:** Hiện tại dùng user_id = 1 (mock) - sau sẽ lấy từ JWT token.
    """
    # Mock current user - sẽ thay bằng get_current_user() sau
    current_user_id = 1
    return await service.get_profile(current_user_id)
