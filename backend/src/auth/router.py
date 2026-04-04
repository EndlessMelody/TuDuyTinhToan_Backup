import jwt
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from src.db.database import get_db
from src.core.config import settings
from src.users.service import UserService
from src.users.schemas import UserMe
from src.core.dependencies import _decode_supabase_token
from typing import Dict, Any

router = APIRouter()

def get_user_service(request: Request, db: AsyncSession = Depends(get_db)) -> UserService:
    return UserService(db=db, redis=request.app.state.redis)

@router.post(
    "/sync",
    response_model=UserMe,
    summary="Đồng bộ User từ Supabase sang PostgreSQL (JIT Provisioning)",
    description="Giải mã token Supabase, trích xuất UUID (sub) và Email để đảm bảo user tồn tại trong DB nội bộ."
)
async def sync_user(
    request: Request, 
    service: UserService = Depends(get_user_service)
):
    # Lấy token từ header Authorization
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")
    
    token = auth_header.split(" ")[1]
    
    try:
        # Decode token bằng HS256 với SUPABASE_JWT_SECRET
        payload = _decode_supabase_token(token)
        
        supabase_uid = payload.get("sub")
        user_metadata = payload.get("user_metadata", {})
        email = payload.get("email") or user_metadata.get("email")
        display_name = user_metadata.get("full_name") or user_metadata.get("name")
        avatar_url = user_metadata.get("avatar_url") or user_metadata.get("picture")
        
        if not supabase_uid or not email:
            raise HTTPException(status_code=401, detail="Token payload is missing required fields (sub, email)")
        
        # JIT Provisioning
        user = await service.get_or_create_supabase_user(
            supabase_uid=supabase_uid,
            email=email,
            display_name=display_name,
            avatar_url=avatar_url
        )
        
        # Trả về thông tin đầy đủ của User
        return await service.get_me(user.id)

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
    except Exception as e:
        import traceback
        with open("error.log", "a", encoding="utf-8") as f:
            f.write(traceback.format_exc() + "\n")
        raise HTTPException(status_code=500, detail=str(e))
