from pydantic import BaseModel
from typing import List, Optional

class CardItem(BaseModel):
    place_id: int
    name: str
    image_url: str
    category: str
    coordinates: Optional[dict] = None

class FeedResponse(BaseModel):
    cards: List[CardItem]
