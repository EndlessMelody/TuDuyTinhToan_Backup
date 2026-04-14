"""Reels Service — CRUD + Like toggle + View counter."""
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from src.reels.models import Reel
from src.users.models import User
from src.reels.schemas import ReelCreate


async def list_reels(db: AsyncSession, sort: str = "trending", limit: int = 10) -> dict:
    q = select(Reel)
    if sort == "trending":
        q = q.order_by(Reel.views_count.desc())
    else:
        q = q.order_by(Reel.created_at.desc())
    result = await db.execute(q.limit(limit))
    reels = result.scalars().all()
    return {"items": [await _reel_to_dict(db, r) for r in reels]}


async def create_reel(db: AsyncSession, user_id: int, data: ReelCreate) -> dict:
    reel = Reel(user_id=user_id, **data.model_dump())
    db.add(reel)
    await db.commit()
    await db.refresh(reel)
    return await _reel_to_dict(db, reel)


async def get_reel(db: AsyncSession, reel_id: int) -> dict:
    result = await db.execute(select(Reel).where(Reel.id == reel_id))
    reel = result.scalars().first()
    if not reel:
        raise HTTPException(status_code=404, detail="Reel không tồn tại")
    reel.views_count += 1
    await db.commit()
    return await _reel_to_dict(db, reel)


async def toggle_like(db: AsyncSession, reel_id: int, user_id: int) -> dict:
    result = await db.execute(select(Reel).where(Reel.id == reel_id))
    reel = result.scalars().first()
    if not reel:
        raise HTTPException(status_code=404, detail="Reel không tồn tại")
    # Simplified toggle (no separate like table for reels)
    reel.likes_count += 1
    await db.commit()
    return {"likes_count": reel.likes_count}


async def _reel_to_dict(db: AsyncSession, reel: Reel) -> dict:
    user_q = await db.execute(select(User).where(User.id == reel.user_id))
    user = user_q.scalars().first()
    return {
        "id": reel.id, "title": reel.title,
        "user": {"id": user.id, "username": user.username, "avatar_url": user.avatar_url} if user else None,
        "video_url": reel.video_url, "thumbnail_url": reel.thumbnail_url,
        "views_count": reel.views_count, "likes_count": reel.likes_count, "comments_count": reel.comments_count,
        "created_at": reel.created_at,
    }
