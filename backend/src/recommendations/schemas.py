from pydantic import BaseModel, conlist
from typing import List

class RecommendationRequest(BaseModel):
    # Require exactly 15 dimensions to match our vector model
    user_vector: conlist(float, min_length=15, max_length=15)
    top_n: int = 5

class PlaceRecommendation(BaseModel):
    place_id: int
    name: str
    match_score: float
    lat: float
    lng: float
    vector: List[float]

class RecommendationResponse(BaseModel):
    recommendations: List[PlaceRecommendation]