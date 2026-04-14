from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from src.db.database import get_db
from src.users.auth_service import AuthService, decode_token

# OAuth2 scheme - token URL points to the login endpoint
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/login/oauth",
    auto_error=False
)


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
) -> dict:
    """
    Validate JWT token and return current user info.
    
    Use this as a dependency in protected endpoints:
    
        @router.get("/protected")
        async def protected_route(user: dict = Depends(get_current_user)):
            return {"message": f"Hello {user['username']}"}
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    if not token:
        raise credentials_exception
    
    # Decode and validate token
    payload = decode_token(token)
    if not payload:
        raise credentials_exception
    
    # Get user from database
    service = AuthService(db)
    user = await service.get_user_by_id(payload.sub)
    
    if not user:
        raise credentials_exception
    
    # Return user info as dict for easy access in endpoints
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "name": user.name,
        "level": user.level,
        "xp": user.xp,
    }


async def get_optional_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
) -> dict | None:
    """
    Optional user dependency - returns None if not authenticated.
    Use for endpoints that work both for guests and logged-in users.
    """
    if not token:
        return None
    
    try:
        return await get_current_user(token, db)
    except HTTPException:
        return None
