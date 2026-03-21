from fastapi import APIRouter
from src.users.router import router as users_router
from src.recommendations.router import router as recommendations_router
from src.sessions.router import router as sessions_router
from src.feed.router import router as feed_router
from src.interactions.router import router as interactions_router

api_router = APIRouter()
api_router.include_router(users_router, prefix="/users", tags=["users"])
api_router.include_router(recommendations_router, prefix="/recommendations", tags=["recommendations"])
api_router.include_router(sessions_router, prefix="/users", tags=["sessions"])
api_router.include_router(feed_router, prefix="/feed", tags=["feed"])
api_router.include_router(interactions_router, prefix="/interactions", tags=["interactions"])
