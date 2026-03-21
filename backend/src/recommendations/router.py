from fastapi import APIRouter
from src.recommendations.schemas import RecommendationRequest, RecommendationResponse
from src.recommendations.service import recommend_top_n_places

router = APIRouter()

@router.post("/", response_model=RecommendationResponse)
async def get_recommendations(request: RecommendationRequest):
    top_places = recommend_top_n_places(
        user_vector=request.user_vector,
        top_n=request.top_n
    )
    
    return {"recommendations": top_places}
