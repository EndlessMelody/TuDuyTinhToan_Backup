from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.db.database import get_db
from src.users.schemas import UserCreate, UserResponse
from src.users.service import UserService

router = APIRouter()

def get_user_service(db: AsyncSession = Depends(get_db)) -> UserService:
    return UserService(db)

@router.post("/", response_model=UserResponse)
async def register_user(
    user_in: UserCreate, 
    service: UserService = Depends(get_user_service)
):
    """
    Register a new user in the system.
    """
    return await service.create_user(user_in)

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int, 
    service: UserService = Depends(get_user_service)
):
    """
    Retrieve user by ID.
    """
    return await service.get_user_by_id(user_id)
