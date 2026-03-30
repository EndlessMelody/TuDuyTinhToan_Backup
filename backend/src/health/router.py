from fastapi import APIRouter

router = APIRouter(tags=["0. Health Check"])

@router.get("/health")
async def health_check():
    return {"status": "ok", "message": "TasteMap Server is running smoothly!"}