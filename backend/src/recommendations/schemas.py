from pydantic import BaseModel, conlist
from typing import List

class RecommendationRequest(BaseModel):
    # Require exactly 8 dimensions based on previous code comment
    user_vector: conlist(float, min_length=8, max_length=8)
    top_n: int = 5

class PlaceRecommendation(BaseModel):
    place_id: int
    name: str
    match_score: float
    vector: List[float]

class RecommendationResponse(BaseModel):
    recommendations: List[PlaceRecommendation]