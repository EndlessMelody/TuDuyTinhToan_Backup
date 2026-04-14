from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    name: Optional[str] = None
    bio: Optional[str] = None
    avatar: Optional[str] = None
    cover: Optional[str] = None
    title: Optional[str] = None
    location: Optional[str] = None
    phone: Optional[str] = None

class UserUpdate(BaseModel):
    name: Optional[str] = None
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    bio: Optional[str] = None
    avatar: Optional[str] = None
    cover: Optional[str] = None
    title: Optional[str] = None
    location: Optional[str] = None
    phone: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    name: Optional[str] = None
    bio: Optional[str] = None
    avatar: Optional[str] = None
    cover: Optional[str] = None
    title: Optional[str] = None
    location: Optional[str] = None
    phone: Optional[str] = None
    joined_at: Optional[datetime] = None
    food_vector: Optional[List[float]] = None
    place_vector: Optional[List[float]] = None
    xp: int
    level: int

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
