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


async def get_inbox(db: AsyncSession, user_id: int) -> list:
    """Return latest conversations with each partner, including last message and unread count."""
    from src.users.models import User

    # Find all partners user has chatted with (as sender or receiver)
    partners_q = await db.execute(
        select(
            ChatMessage.sender_id.label("partner_id"),
        )
        .where(ChatMessage.receiver_id == user_id)
        .distinct()
    )
    partners_q2 = await db.execute(
        select(
            ChatMessage.receiver_id.label("partner_id"),
        )
        .where(ChatMessage.sender_id == user_id)
        .distinct()
    )

    partner_ids = {row[0] for row in partners_q.all()} | {row[0] for row in partners_q2.all()}

    inbox = []
    for partner_id in partner_ids:
        if partner_id == user_id:
            continue

        # Get partner user info
        partner_user = await db.get(User, partner_id)
        if not partner_user:
            continue

        # Get last message between user and partner
        last_msg_q = await db.execute(
            select(ChatMessage)
            .where(
                or_(
                    and_(ChatMessage.sender_id == user_id, ChatMessage.receiver_id == partner_id),
                    and_(ChatMessage.sender_id == partner_id, ChatMessage.receiver_id == user_id),
                )
            )
            .order_by(ChatMessage.created_at.desc())
            .limit(1)
        )
        last_msg = last_msg_q.scalar_one_or_none()
        if not last_msg:
            continue

        # Count unread messages from this partner
        unread_q = await db.execute(
            select(ChatMessage).where(
                ChatMessage.sender_id == partner_id,
                ChatMessage.receiver_id == user_id,
                ChatMessage.is_read == False,  # noqa: E712
            )
        )
        unread_count = len(unread_q.scalars().all())

        inbox.append({
            "partner_id": partner_id,
            "partner_name": partner_user.display_name or partner_user.username or "Unknown",
            "partner_avatar": partner_user.avatar_url,
            "last_message": last_msg.text,
            "last_message_time": _fmt_time(last_msg.created_at),
            "last_message_at": last_msg.created_at.isoformat() if last_msg.created_at else None,
            "unread_count": unread_count,
            "is_sent_by_me": last_msg.sender_id == user_id,
        })

    # Sort by most recent message
    inbox.sort(key=lambda x: x["last_message_at"] or "", reverse=True)
    return inbox
