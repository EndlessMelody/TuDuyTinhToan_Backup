from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


class UserStats(BaseModel):
    reviews: int = 0
    visited: int = 0
    followers: int = 0
    following: int = 0


class BadgeSummary(BaseModel):
    icon: str
    label: str
    color: str

    class Config:
        from_attributes = True


class TopSpotResponse(BaseModel):
    id: int
    name: str
    image_url: Optional[str] = None
    rating: Optional[float] = None

    class Config:
        from_attributes = True


# ─── Base ───────────────────────────────────────────────────────────────────

class UserBase(BaseModel):
    username: str
    email: EmailStr


# ─── Auth & Registration ──────────────────────────────────────────────────

class UserCreate(UserBase):
    """Đăng ký user mới. device_id để móc vector từ Redis."""
    password: Optional[str] = None
    device_id: Optional[str] = None


# ─── PATCH Profile ───────────────────────────────────────────────────────

class UserUpdate(BaseModel):
    display_name: Optional[str] = None
    username: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    cover_url: Optional[str] = None
    location: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None


# ─── Responses ───────────────────────────────────────────────────────────

class UserResponse(BaseModel):
    """Response cơ bản sau register / get_by_id."""
    id: int
    username: str
    email: str
    display_name: Optional[str] = None
    food_vector: Optional[List[float]] = None
    place_vector: Optional[List[float]] = None
    xp: int = 0
    level: int = 1

    class Config:
        from_attributes = True


class UserProfile(BaseModel):
    """Public profile — GET /users/{id}"""
    id: int
    username: str
    display_name: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    cover_url: Optional[str] = None
    location: Optional[str] = None
    title: Optional[str] = None
    xp: int = 0
    level: int = 1
    created_at: Optional[datetime] = None
    stats: UserStats = UserStats()
    badges: List[BadgeSummary] = []

    class Config:
        from_attributes = True


class UserMe(BaseModel):
    """Private profile — GET /users/me (bao gồm cả private fields)"""
    id: int
    username: str
    email: str
    display_name: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    cover_url: Optional[str] = None
    location: Optional[str] = None
    title: Optional[str] = None
    phone: Optional[str] = None
    xp: int = 0
    level: int = 1
    food_vector: Optional[List[float]] = None
    place_vector: Optional[List[float]] = None
    settings: Optional[dict] = None
    created_at: Optional[datetime] = None
    stats: UserStats = UserStats()
    badges: List[BadgeSummary] = []

    class Config:
        from_attributes = True


# ─── Authentication Schemas ───

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int  # seconds

class TokenPayload(BaseModel):
    sub: int  # user_id
    exp: datetime
    type: str = "access"

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    username: str
    email: EmailStr
    password: str
    name: Optional[str] = None

class AuthResponse(BaseModel):
    """Response sau khi login/register thành công"""
    token: Token
    user: UserResponse


# ─── Profile Schemas (cho /profile page) ───

class UserStats(BaseModel):
    reviews: int = 0
    visited: int = 0
    followers: int = 0
    following: int = 0

class Badge(BaseModel):
    icon: str
    label: str
    color: str

class RadarDataPoint(BaseModel):
    subject: str
    A: float
    fullMark: int = 150

class Post(BaseModel):
    id: int
    img: str
    likes: int
    comments: int

class TopSpot(BaseModel):
    name: str
    img: str
    rating: float
    category: str

class ProfileResponse(BaseModel):
    """Full profile data cho /profile page"""
    id: int
    name: str
    username: str
    email: str
    bio: Optional[str] = None
    avatar: Optional[str] = None
    cover: Optional[str] = None
    title: Optional[str] = None
    location: Optional[str] = None
    phone: Optional[str] = None
    joined: str  # formatted like "March 2025"
    
    # Gamification
    level: int
    xp: int
    nextLevelXp: int  # calculated: level * 100
    
    # Stats
    stats: UserStats
    
    # Taste DNA (radar chart data)
    radarData: List[RadarDataPoint]
    
    # Achievements
    badges: List[Badge]
    
    # Content
    posts: List[Post]
    topSpots: List[TopSpot]

    class Config:
        from_attributes = True
