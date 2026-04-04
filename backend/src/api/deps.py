from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from src.db.database import get_db

# Dummy current user dependency, would normally decode JWT token
async def get_current_user(db: AsyncSession = Depends(get_db)):
    return None
