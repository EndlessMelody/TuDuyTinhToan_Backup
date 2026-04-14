from pydantic import BaseModel
from typing import Optional, List


class CardResponse(BaseModel):
    id: int
    name: str
    image_url: Optional[str] = None
    tags: List[str] = []
    price_range: Optional[str] = None
    rating: Optional[float] = None
    distance_km: Optional[float] = None
    match_percent: Optional[int] = None
    # Flip card data — populated server-side to avoid extra API call
    photos: List[str] = []
    reviews_preview: List[str] = []


class FeedResponse(BaseModel):
    cards: List[CardResponse]
