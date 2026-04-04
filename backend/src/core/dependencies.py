"""
Shared dependency injection utilities.
JWT verification for Supabase using HS256 (default for standard Supabase projects).
"""
import jwt
from fastapi import HTTPException, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import Optional
from src.db.database import get_db
from src.core.config import settings
from src.users.models import User

# Security scheme for Swagger UI
reusable_oauth2 = HTTPBearer()

def _decode_supabase_token(token: str) -> dict:
    """Decode a Supabase JWT using the project's JWT secret (HS256)."""
    secret = settings.SUPABASE_JWT_SECRET
    if not secret:
        raise HTTPException(status_code=500, detail="SUPABASE_JWT_SECRET not configured")
    return jwt.decode(
        token,
        secret,
        algorithms=["HS256"],
        audience="authenticated"
    )

async def get_current_user_id(
    http_auth: HTTPAuthorizationCredentials = Depends(reusable_oauth2),
    db: AsyncSession = Depends(get_db)
) -> int:
    """
    Xác thực JWT từ Supabase.
    1. Decode token bằng JWKS.
    2. Lấy 'sub' (UUID).
    3. Tìm user trong DB có supabase_uid tương ứng.
    """
    token = http_auth.credentials
    try:
        payload = _decode_supabase_token(token)
        supabase_uid = payload.get("sub")
        if not supabase_uid:
            raise HTTPException(status_code=401, detail="Token không hợp lệ: thiếu 'sub'")
        
        # Truy vấn user từ Database
        result = await db.execute(select(User.id).where(User.supabase_uid == supabase_uid))
        user_id = result.scalar_one_or_none()
        
        if not user_id:
            raise HTTPException(
                status_code=401, 
                detail="User chưa được đồng bộ vào Database nội bộ. Vui lòng gọi API /sync trước."
            )
        
        return user_id

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token đã hết hạn")
    except jwt.InvalidTokenError as e:
        raise HTTPException(status_code=401, detail=f"Token không hợp lệ: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Lỗi xác thực: {str(e)}")


async def get_optional_user_id(
    request: Request,
    db: AsyncSession = Depends(get_db)
) -> Optional[int]:
    """
    Tương tự get_current_user_id nhưng không bắt buộc.
    Dùng Request để check header Authorization thủ công tránh trigger 401 của HTTPBearer.
    """
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None
    
    token = auth_header.split(" ")[1]
    try:
        payload = _decode_supabase_token(token)
        supabase_uid = payload.get("sub")
        if not supabase_uid:
            return None
            
        result = await db.execute(select(User.id).where(User.supabase_uid == supabase_uid))
        return result.scalar_one_or_none()
    except:
        return None
