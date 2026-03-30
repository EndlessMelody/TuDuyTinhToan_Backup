from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.db.database import get_db
from src.gamification import service
from src.core.dependencies import get_current_user_id

router = APIRouter()


@router.get("/", summary="Tất cả badges trong hệ thống")
async def list_all_badges(db: AsyncSession = Depends(get_db)):
    return await service.list_all_badges(db)


@router.get("/me", summary="Badges của tôi")
async def my_badges(user_id: int = Depends(get_current_user_id), db: AsyncSession = Depends(get_db)):
    return await service.list_user_badges(db, user_id)


@router.get("/{user_id}", summary="Badges của user bất kỳ")
async def user_badges(user_id: int, db: AsyncSession = Depends(get_db)):
    return await service.list_user_badges(db, user_id)
