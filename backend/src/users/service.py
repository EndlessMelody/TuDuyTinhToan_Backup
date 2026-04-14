from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import datetime
from typing import List, Optional

from src.users.models import User
from src.users.schemas import (
    UserCreate, UserUpdate, ProfileResponse, UserStats,
    Badge, RadarDataPoint, Post, TopSpot
)


class UserService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_user_by_id(self, user_id: int):
        result = await self.db.execute(select(User).filter(User.id == user_id))
        user = result.scalars().first()
        if not user:
            raise HTTPException(status_code=404, detail="Không tìm thấy người dùng")
        return user

    async def create_user(self, user_create: UserCreate):
        new_user = User(
            username=user_create.username,
            email=user_create.email,
            name=user_create.name,
            bio=user_create.bio,
            avatar=user_create.avatar,
            cover=user_create.cover,
            title=user_create.title,
            location=user_create.location,
            phone=user_create.phone,
        )
        self.db.add(new_user)
        try:
            await self.db.commit()
            await self.db.refresh(new_user)
            return new_user
        except Exception as e:
            await self.db.rollback()
            raise HTTPException(status_code=400, detail=f"Không thể tạo người dùng: {str(e)}")

    async def update_user(self, user_id: int, user_update: UserUpdate):
        result = await self.db.execute(select(User).filter(User.id == user_id))
        user = result.scalars().first()
        if not user:
            raise HTTPException(status_code=404, detail="Không tìm thấy người dùng")
        
        update_data = user_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(user, field, value)
        
        try:
            await self.db.commit()
            await self.db.refresh(user)
            return user
        except Exception as e:
            await self.db.rollback()
            raise HTTPException(status_code=400, detail=f"Không thể cập nhật: {str(e)}")


class ProfileService:
    """Service cho /profile endpoint - trả về full profile với Taste DNA"""
    
    # Taste DNA radar chart subjects (6 dimensions)
    RADAR_SUBJECTS = [
        "Street Food",   # food_vector[0]
        "Spicy",         # food_vector[1] 
        "Sweet",         # food_vector[2]
        "Luxury",        # place_vector[0]
        "Quiet",         # place_vector[1]
        "Group",         # place_vector[2]
    ]
    
    # Default badges based on level
    BADGES = [
        {"icon": "🔥", "label": "Spice Master", "color": "#E63946"},
        {"icon": "🌙", "label": "Night Owl", "color": "#7B2FF7"},
        {"icon": "📸", "label": "Photo Pro", "color": "#2A9D8F"},
        {"icon": "👑", "label": "Top Reviewer", "color": "#FBBF24"},
    ]
    
    def __init__(self, db: AsyncSession):
        self.db = db

    def _vector_to_radar_data(self, food_vector: List[float], place_vector: List[float]) -> List[RadarDataPoint]:
        """Convert 15-dim vectors thành 6-dim radar chart data"""
        # Scale 0-1 vector thành 0-150 score
        def scale_to_score(val: float) -> float:
            return round(val * 150, 1)
        
        # Lấy first 3 dims từ mỗi vector
        radar_values = [
            scale_to_score(food_vector[0]) if len(food_vector) > 0 else 75,
            scale_to_score(food_vector[1]) if len(food_vector) > 1 else 75,
            scale_to_score(food_vector[2]) if len(food_vector) > 2 else 75,
            scale_to_score(place_vector[0]) if len(place_vector) > 0 else 75,
            scale_to_score(place_vector[1]) if len(place_vector) > 1 else 75,
            scale_to_score(place_vector[2]) if len(place_vector) > 2 else 75,
        ]
        
        return [
            RadarDataPoint(subject=subj, A=val, fullMark=150)
            for subj, val in zip(self.RADAR_SUBJECTS, radar_values)
        ]

    def _format_joined_date(self, joined_at: Optional[datetime]) -> str:
        """Format datetime thành 'March 2025'"""
        if not joined_at:
            return "Recently"
        return joined_at.strftime("%B %Y")

    def _get_badges_for_user(self, level: int, xp: int) -> List[Badge]:
        """Return badges based on user level/xp"""
        badges = []
        if level >= 10:
            badges.append(Badge(**self.BADGES[0]))  # Spice Master
        if level >= 25:
            badges.append(Badge(**self.BADGES[1]))  # Night Owl
        if xp >= 500:
            badges.append(Badge(**self.BADGES[2]))  # Photo Pro
        if level >= 50:
            badges.append(Badge(**self.BADGES[3]))  # Top Reviewer
        
        # Default badge nếu chưa có gì
        if not badges:
            badges.append(Badge(icon="🌟", label="New Explorer", color="#007AFF"))
        
        return badges

    def _get_mock_posts(self, user_id: int) -> List[Post]:
        """Mock posts - sẽ thay bằng real posts từ DB sau"""
        return [
            Post(id=1, img="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop", likes=124, comments=12),
            Post(id=2, img="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop", likes=89, comments=5),
            Post(id=3, img="https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?w=400&h=400&fit=crop", likes=231, comments=18),
        ]

    def _get_mock_top_spots(self, user_id: int) -> List[TopSpot]:
        """Mock top spots - sẽ thay bằng real data từ DB sau"""
        return [
            TopSpot(name="Bún Bò O Trắng", img="https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=200&h=200&fit=crop", rating=4.9, category="Noodle"),
            TopSpot(name="Matcha Garden", img="https://images.unsplash.com/photo-1582787895088-2ff176b668d2?w=200&h=200&fit=crop", rating=4.7, category="Cafe"),
            TopSpot(name="Neon Ramen House", img="https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200&h=200&fit=crop", rating=4.8, category="Ramen"),
        ]

    async def get_profile(self, user_id: int) -> ProfileResponse:
        """Get full profile cho /profile page"""
        result = await self.db.execute(select(User).filter(User.id == user_id))
        user = result.scalars().first()
        
        if not user:
            raise HTTPException(status_code=404, detail="Không tìm thấy người dùng")
        
        # Convert vectors to Taste DNA radar data
        food_vec = list(user.food_vector) if user.food_vector else [0.5] * 15
        place_vec = list(user.place_vector) if user.place_vector else [0.5] * 15
        radar_data = self._vector_to_radar_data(food_vec, place_vec)
        
        # Build stats (mock for now - sẽ query từ interactions sau)
        stats = UserStats(
            reviews=user.level * 3,  # Mock: level * 3
            visited=user.xp // 10,   # Mock: xp / 10
            followers=user.level * 20,  # Mock
            following=user.level * 5,   # Mock
        )
        
        return ProfileResponse(
            id=user.id,
            name=user.name or user.username,
            username=f"@{user.username}",
            email=user.email,
            bio=user.bio or "",
            avatar=user.avatar,
            cover=user.cover,
            title=user.title or "Food Explorer",
            location=user.location or "Vietnam",
            phone=user.phone,
            joined=self._format_joined_date(user.joined_at),
            level=user.level,
            xp=user.xp,
            nextLevelXp=user.level * 100,
            stats=stats,
            radarData=radar_data,
            badges=self._get_badges_for_user(user.level, user.xp),
            posts=self._get_mock_posts(user.id),
            topSpots=self._get_mock_top_spots(user.id),
        )
