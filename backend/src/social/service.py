"""Social Service — Friend request lifecycle."""
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import or_
from src.social.models import Friendship
from src.users.models import User


async def list_friends(db: AsyncSession, user_id: int) -> dict:
    result = await db.execute(
        select(Friendship, User)
        .join(User, or_(
            (Friendship.friend_id == User.id) & (Friendship.user_id == user_id),
            (Friendship.user_id == User.id) & (Friendship.friend_id == user_id)
        ))
        .where(
            Friendship.status == "accepted",
            or_(Friendship.user_id == user_id, Friendship.friend_id == user_id)
        )
    )
    rows = result.all()
    items = []
    for fs, user in rows:
        friend_id = fs.friend_id if fs.user_id == user_id else fs.user_id
        if user.id == friend_id:
            items.append({
                "friendship_id": fs.id,
                "user": {"id": user.id, "display_name": user.display_name, "avatar_url": user.avatar_url},
                "status": "accepted",
                "since": fs.created_at,
            })
    return {"items": items}


async def send_request(db: AsyncSession, user_id: int, friend_id: int) -> dict:
    if user_id == friend_id:
        raise HTTPException(status_code=400, detail="Không thể kết bạn với chính mình")
    existing = await db.execute(
        select(Friendship).where(
            or_(
                (Friendship.user_id == user_id) & (Friendship.friend_id == friend_id),
                (Friendship.user_id == friend_id) & (Friendship.friend_id == user_id)
            )
        )
    )
    if existing.scalars().first():
        raise HTTPException(status_code=400, detail="Đã có quan hệ bạn bè / yêu cầu đang chờ")
    fs = Friendship(user_id=user_id, friend_id=friend_id, status="pending")
    db.add(fs)
    await db.commit()
    return {"status": "pending"}


async def accept_request(db: AsyncSession, friendship_id: int, user_id: int) -> dict:
    result = await db.execute(select(Friendship).where(Friendship.id == friendship_id, Friendship.friend_id == user_id))
    fs = result.scalars().first()
    if not fs:
        raise HTTPException(status_code=404, detail="Lời mời không tồn tại")
    fs.status = "accepted"
    await db.commit()
    return {"status": "accepted"}


async def block_friend(db: AsyncSession, friendship_id: int, user_id: int) -> dict:
    result = await db.execute(
        select(Friendship).where(Friendship.id == friendship_id, or_(Friendship.user_id == user_id, Friendship.friend_id == user_id))
    )
    fs = result.scalars().first()
    if not fs:
        raise HTTPException(status_code=404, detail="Không tìm thấy")
    fs.status = "blocked"
    await db.commit()
    return {"status": "blocked"}


async def delete_friendship(db: AsyncSession, friendship_id: int, user_id: int) -> dict:
    result = await db.execute(
        select(Friendship).where(Friendship.id == friendship_id, or_(Friendship.user_id == user_id, Friendship.friend_id == user_id))
    )
    fs = result.scalars().first()
    if not fs:
        raise HTTPException(status_code=404, detail="Không tìm thấy")
    await db.delete(fs)
    await db.commit()
    return {"status": "deleted"}


async def list_pending_requests(db: AsyncSession, user_id: int) -> dict:
    result = await db.execute(
        select(Friendship, User)
        .join(User, User.id == Friendship.user_id)
        .where(Friendship.friend_id == user_id, Friendship.status == "pending")
    )
    rows = result.all()
    return {"items": [
        {"friendship_id": fs.id, "from_user": {"id": u.id, "display_name": u.display_name, "avatar_url": u.avatar_url}, "created_at": fs.created_at}
        for fs, u in rows
    ]}
