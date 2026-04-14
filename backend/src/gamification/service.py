"""Gamification Service — Badge management."""
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import datetime, timezone

from src.gamification.models import Badge, UserBadge
from src.users.models import User


async def list_all_badges(db: AsyncSession) -> dict:
    result = await db.execute(select(Badge))
    badges = result.scalars().all()
    return {"items": [{"id": b.id, "icon": b.icon, "label": b.label, "color": b.color, "description": b.description} for b in badges]}


async def list_user_badges(db: AsyncSession, user_id: int) -> dict:
    result = await db.execute(
        select(UserBadge, Badge)
        .join(Badge, Badge.id == UserBadge.badge_id)
        .where(UserBadge.user_id == user_id)
    )
    rows = result.all()
    return {"items": [
        {
            "badge": {"id": b.id, "icon": b.icon, "label": b.label, "color": b.color, "description": b.description},
            "earned_at": ub.earned_at,
        }
        for ub, b in rows
    ]}


async def award_badge(db: AsyncSession, user_id: int, badge_id: int) -> dict:
    """Internal: awards a badge to a user. Idempotent."""
    existing = await db.execute(select(UserBadge).where(UserBadge.user_id == user_id, UserBadge.badge_id == badge_id))
    if existing.scalars().first():
        return {"status": "already_awarded"}
    ub = UserBadge(user_id=user_id, badge_id=badge_id, earned_at=datetime.now(timezone.utc))
    db.add(ub)
    await db.commit()
    return {"status": "awarded"}
