from pydantic import BaseModel, EmailStr
from typing import Optional, List
from enum import Enum


class InteractionAction(str, Enum):
    """
    Validation ở tầng Pydantic, KHÔNG ở DB.
    DB lưu String thuần → dễ thêm action mới mà không cần ALTER TYPE.
    """
    LIKED = "LIKED"
    DISLIKED = "DISLIKED"
    SKIPPED = "SKIPPED"
    SAVED = "SAVED"
    # Mở rộng sau: SUPER_LIKE = "SUPER_LIKE"


class UserBase(BaseModel):
    username: str
    email: EmailStr


class UserCreate(UserBase):
    """Đăng ký user mới. device_id để móc vector từ Redis."""
    password: Optional[str] = None
    device_id: Optional[str] = None  # Để migrate vector từ Redis khi guest đăng ký


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    food_vector: Optional[List[float]] = None
    place_vector: Optional[List[float]] = None
    xp: int
    level: int

    class Config:
        from_attributes = True
