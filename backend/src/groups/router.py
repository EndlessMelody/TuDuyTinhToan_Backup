from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from src.db.database import get_db
from src.groups import service
from src.groups.schemas import GroupCreate, GroupResponse, GroupListResponse, ReadyUpdate, GroupRecommendRequest, GroupRecommendResponse
from src.core.dependencies import get_current_user_id
from typing import Optional

router = APIRouter()


@router.post("/", summary="Tạo lobby nhóm mới", status_code=201)
async def create_group(
    body: GroupCreate,
    user_id: int = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    return await service.create_group(db, body, user_id)


@router.get("/", summary="Danh sách lobby")
async def list_groups(
    status: str = Query("active"),
    limit: int = Query(10, ge=1, le=50),
    db: AsyncSession = Depends(get_db)
):
    return {"items": await service.list_groups(db, status, limit)}


@router.get("/{group_id}", summary="Chi tiết lobby")
async def get_group(group_id: int, db: AsyncSession = Depends(get_db)):
    return await service.get_group(db, group_id)


@router.post("/{group_id}/join", summary="Tham gia lobby")
async def join_group(
    group_id: int,
    user_id: int = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    return await service.join_group(db, group_id, user_id)


@router.post("/{group_id}/leave", summary="Rời lobby")
async def leave_group(
    group_id: int,
    user_id: int = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    return await service.leave_group(db, group_id, user_id)


@router.patch("/{group_id}/ready", summary="Toggle trạng thái ready")
async def set_ready(
    group_id: int,
    body: ReadyUpdate,
    user_id: int = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    return await service.set_ready(db, group_id, user_id, body.is_ready)


@router.post("/{group_id}/recommend", summary="Minimax Referee — Gợi ý địa điểm cho nhóm")
async def group_recommend(
    group_id: int,
    body: GroupRecommendRequest,
    db: AsyncSession = Depends(get_db)
):
    return await service.group_recommend(db, group_id, body)
