from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class FriendRequest(BaseModel):
    friend_id: int


class UserStub(BaseModel):
    id: int
    display_name: Optional[str] = None
    avatar_url: Optional[str] = None


class FriendResponse(BaseModel):
    friendship_id: int
    user: Optional[UserStub] = None
    status: str
    since: Optional[datetime] = None


class FriendListResponse(BaseModel):
    items: List[FriendResponse]


class PendingRequest(BaseModel):
    friendship_id: int
    from_user: Optional[UserStub] = None
    created_at: Optional[datetime] = None
