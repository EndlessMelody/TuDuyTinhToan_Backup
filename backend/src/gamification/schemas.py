from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class BadgeResponse(BaseModel):
    id: int
    icon: str
    label: str
    color: str
    description: Optional[str] = None

    class Config:
        from_attributes = True


class UserBadgeResponse(BaseModel):
    badge: BadgeResponse
    earned_at: Optional[datetime] = None


class MediaUploadResponse(BaseModel):
    url: str
    file_type: str
    size_bytes: int
