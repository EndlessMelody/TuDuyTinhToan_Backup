from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class MemberSummary(BaseModel):
    user_id: int
    display_name: Optional[str] = None
    avatar_url: Optional[str] = None
    is_ready: bool = False


class GroupCreate(BaseModel):
    name: str
    route_description: Optional[str] = None
    scheduled_time: Optional[datetime] = None
    max_spots: int = 6
    cover_image_url: Optional[str] = None
    accent_color: Optional[str] = None


class GroupResponse(BaseModel):
    id: int
    name: str
    status: str
    route_description: Optional[str] = None
    scheduled_time: Optional[datetime] = None
    max_spots: int = 6
    cover_image_url: Optional[str] = None
    accent_color: Optional[str] = None
    created_at: Optional[datetime] = None
    members: List[MemberSummary] = []
    spots_remaining: int = 0

    class Config:
        from_attributes = True


class GroupListResponse(BaseModel):
    items: List[GroupResponse]


class ReadyUpdate(BaseModel):
    is_ready: bool


class GroupRecommendRequest(BaseModel):
    lat: float
    lng: float
    category: str = "food"
    meal_slot: Optional[str] = None
    top_n: int = 5


class MemberScore(BaseModel):
    user_id: int
    display_name: Optional[str] = None
    score: float
    compromise: float


class GroupPlaceResult(BaseModel):
    place_id: int
    name: str
    group_score: float
    member_scores: List[MemberScore]
    most_compromised_member: Optional[str] = None
    compensation_note: Optional[str] = None


class GroupRecommendResponse(BaseModel):
    group_vector: List[float]
    recommendations: List[GroupPlaceResult]
