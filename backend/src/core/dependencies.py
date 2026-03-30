"""
Shared dependency injection utilities.

get_current_user: Stub — reads user_id from X-User-ID header.
Replace with real JWT parsing (e.g., python-jose) in the next sprint.
"""
from fastapi import Header, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import Optional
from src.db.database import get_db


async def get_current_user_id(
    x_user_id: Optional[str] = Header(None, alias="X-User-ID"),
) -> int:
    """
    Stub auth: reads user ID from X-User-ID header.
    Frontend should send this header after login.
    Replace with real JWT verification in next sprint.
    """
    if x_user_id is None:
        raise HTTPException(status_code=401, detail="Không xác thực: thiếu header X-User-ID")
    try:
        return int(x_user_id)
    except ValueError:
        raise HTTPException(status_code=401, detail="X-User-ID không hợp lệ")


async def get_optional_user_id(
    x_user_id: Optional[str] = Header(None, alias="X-User-ID"),
) -> Optional[int]:
    """Giống get_current_user_id nhưng không bắt buộc — cho phép guest."""
    if x_user_id is None:
        return None
    try:
        return int(x_user_id)
    except ValueError:
        return None
