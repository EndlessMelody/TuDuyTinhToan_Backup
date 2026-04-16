from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.database import get_db
from src.core.dependencies import get_current_user_id
from src.messages import service

router = APIRouter()


class SendMessageBody(BaseModel):
    text: str


@router.get("/inbox", summary="Get inbox - all conversations with last message")
async def get_inbox(
    user_id: int = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    return await service.get_inbox(db, user_id)


@router.get("/{other_user_id}", summary="Get conversation with a user")
async def get_conversation(
    other_user_id: int,
    limit: int = Query(60, ge=1, le=200),
    offset: int = Query(0, ge=0),
    user_id: int = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    return await service.get_conversation(db, user_id, other_user_id, limit, offset)


@router.post("/{other_user_id}", summary="Send a message to a user")
async def send_message(
    other_user_id: int,
    body: SendMessageBody,
    user_id: int = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    return await service.send_message(db, user_id, other_user_id, body.text)


@router.patch("/{other_user_id}/read", summary="Mark all messages from user as read")
async def mark_read(
    other_user_id: int,
    user_id: int = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    await service.mark_read(db, user_id, other_user_id)
    return {"status": "ok"}
