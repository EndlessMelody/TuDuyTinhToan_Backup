"""
Authentication router with /login and /register endpoints.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.database import get_db
from src.users.auth_service import AuthService, create_access_token, user_to_response, decode_token
from src.users.schemas import LoginRequest, RegisterRequest, AuthResponse, Token, UserResponse

router = APIRouter(prefix="/auth", tags=["authentication"])

# OAuth2 scheme for token URL
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


def get_auth_service(db: AsyncSession = Depends(get_db)) -> AuthService:
    return AuthService(db)


@router.post("/register", response_model=AuthResponse)
async def register(
    request: RegisterRequest,
    service: AuthService = Depends(get_auth_service)
):
    """
    Register a new user account.
    
    - **username**: Unique username
    - **email**: Valid email address
    - **password**: Password (will be hashed)
    - **name**: Optional display name
    
    Returns access token and user info on success.
    """
    # Create user with password
    user = await service.register_user(
        username=request.username,
        email=request.email,
        password=request.password,
        name=request.name
    )
    
    # Create access token
    token = create_access_token(user.id)
    
    return AuthResponse(
        token=token,
        user=user_to_response(user)
    )


@router.post("/login", response_model=AuthResponse)
async def login(
    request: LoginRequest,
    service: AuthService = Depends(get_auth_service)
):
    """
    Login with email and password.
    
    - **email**: User's email address
    - **password**: User's password
    
    Returns access token and user info on success.
    """
    # Authenticate user
    user = await service.authenticate_user(request.email, request.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    token = create_access_token(user.id)
    
    return AuthResponse(
        token=token,
        user=user_to_response(user)
    )


@router.post("/login/oauth", response_model=AuthResponse)
async def login_oauth(
    form_data: OAuth2PasswordRequestForm = Depends(),
    service: AuthService = Depends(get_auth_service)
):
    """
    OAuth2 compatible token login, returns an access token.
    
    This endpoint is for OAuth2 clients (like Swagger UI).
    Use /auth/login for JSON-based login.
    """
    # OAuth2 form uses username field for email
    user = await service.authenticate_user(form_data.username, form_data.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = create_access_token(user.id)
    
    return AuthResponse(
        token=token,
        user=user_to_response(user)
    )


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    token: str = Depends(oauth2_scheme),
    service: AuthService = Depends(get_auth_service)
):
    """
    Get current logged-in user information.
    
    Requires a valid Bearer token in the Authorization header.
    """
    payload = decode_token(token)
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = await service.get_user_by_id(payload.sub)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user_to_response(user)
