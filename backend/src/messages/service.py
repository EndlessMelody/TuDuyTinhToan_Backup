from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import or_, and_

from src.messages.models import ChatMessage


def _fmt_time(dt) -> str:
    if dt is None:
        return ""
    return dt.strftime("%I:%M %p").lstrip("0")


def _to_dict(m: ChatMessage, current_user_id: int) -> dict:
    return {
        "id": m.id,
        "text": m.text,
        "sender": "me" if m.sender_id == current_user_id else "them",
        "time": _fmt_time(m.created_at),
        "is_read": m.is_read,
        "created_at": m.created_at.isoformat() if m.created_at else None,
    }


async def get_conversation(
    db: AsyncSession, user_id: int, other_id: int, limit: int = 60, offset: int = 0
) -> list:
    result = await db.execute(
        select(ChatMessage)
        .where(
            or_(
                and_(ChatMessage.sender_id == user_id, ChatMessage.receiver_id == other_id),
                and_(ChatMessage.sender_id == other_id, ChatMessage.receiver_id == user_id),
            )
        )
        .order_by(ChatMessage.created_at.asc())
        .limit(limit)
        .offset(offset)
    )
    return [_to_dict(m, user_id) for m in result.scalars().all()]


async def send_message(db: AsyncSession, sender_id: int, receiver_id: int, text: str) -> dict:
    msg = ChatMessage(sender_id=sender_id, receiver_id=receiver_id, text=text.strip())
    db.add(msg)
    await db.commit()
    await db.refresh(msg)
    return _to_dict(msg, sender_id)


async def mark_read(db: AsyncSession, user_id: int, other_id: int) -> None:
    result = await db.execute(
        select(ChatMessage).where(
            ChatMessage.sender_id == other_id,
            ChatMessage.receiver_id == user_id,
            ChatMessage.is_read == False,  # noqa: E712
        )
    )
    for m in result.scalars().all():
        m.is_read = True
    await db.commit()
