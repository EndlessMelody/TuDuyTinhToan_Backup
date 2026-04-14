"""Bookmarks Service — save locations + auto XP reward."""
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from src.bookmarks.models import Bookmark
from src.locations.models import Location
from src.users.models import User
from src.bookmarks.schemas import BookmarkCreate

XP_PER_BOOKMARK = 10


async def list_bookmarks(db: AsyncSession, user_id: int, limit: int, offset: int) -> dict:
    q = select(Bookmark).where(Bookmark.user_id == user_id)
    count_r = await db.execute(select(func.count()).select_from(q.subquery()))
    total = count_r.scalar_one() or 0
    q = q.order_by(Bookmark.created_at.desc()).offset(offset).limit(limit)
    result = await db.execute(q)
    bookmarks = result.scalars().all()
    items = [await _bookmark_to_dict(db, b) for b in bookmarks]
    return {"items": items, "total": total}


async def add_bookmark(db: AsyncSession, user_id: int, data: BookmarkCreate) -> dict:
    existing_q = await db.execute(
        select(Bookmark).where(Bookmark.user_id == user_id, Bookmark.location_id == data.location_id)
    )
    if existing_q.scalars().first():
        raise HTTPException(status_code=400, detail="Đã bookmark rồi")

    bm = Bookmark(user_id=user_id, location_id=data.location_id, xp_earned=XP_PER_BOOKMARK)
    db.add(bm)

    # Award XP to user
    user_q = await db.execute(select(User).where(User.id == user_id))
    user = user_q.scalars().first()
    if user:
        user.xp = (user.xp or 0) + XP_PER_BOOKMARK

    await db.commit()
    await db.refresh(bm)
    return {"id": bm.id, "xp_earned": XP_PER_BOOKMARK, "total_xp": user.xp if user else XP_PER_BOOKMARK}


async def delete_bookmark(db: AsyncSession, bookmark_id: int, user_id: int) -> dict:
    result = await db.execute(select(Bookmark).where(Bookmark.id == bookmark_id, Bookmark.user_id == user_id))
    bm = result.scalars().first()
    if not bm:
        raise HTTPException(status_code=404, detail="Bookmark không tồn tại")
    await db.delete(bm)
    await db.commit()
    return {"status": "deleted"}


async def _bookmark_to_dict(db: AsyncSession, bm: Bookmark) -> dict:
    loc_q = await db.execute(select(Location).where(Location.id == bm.location_id))
    loc = loc_q.scalars().first()
    return {
        "id": bm.id,
        "location": {"id": loc.id, "name": loc.name, "image_url": loc.image_url, "rating": loc.rating,
                     "category": loc.category, "price_range": loc.price_range} if loc else None,
        "xp_earned": bm.xp_earned,
        "created_at": bm.created_at,
    }
