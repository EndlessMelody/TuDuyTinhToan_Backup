"""
Users Service — extended with profile, stats, top-spots, settings.
"""
import json
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
import redis.asyncio as aioredis
from typing import Optional, List

from src.users.models import User
from src.users.schemas import UserCreate, UserUpdate, UserStats, BadgeSummary, UserProfile, UserMe
from src.posts.models import Post
from src.bookmarks.models import Bookmark
from src.social.models import Friendship
from src.gamification.models import UserBadge, Badge


class UserService:
    def __init__(self, db: AsyncSession, redis: Optional[aioredis.Redis] = None):
        self.db = db
        self.redis = redis

    # ─── Helpers ──────────────────────────────────────────────────────────

    async def _get_user_or_404(self, user_id: int) -> User:
        result = await self.db.execute(select(User).where(User.id == user_id))
        user = result.scalars().first()
        if not user:
            raise HTTPException(status_code=404, detail="Không tìm thấy người dùng")
        return user

    async def _compute_stats(self, user_id: int) -> UserStats:
        reviews_q = await self.db.execute(
            select(func.count()).select_from(Post).where(Post.user_id == user_id)
        )
        visited_q = await self.db.execute(
            select(func.count()).select_from(Bookmark).where(Bookmark.user_id == user_id)
        )
        followers_q = await self.db.execute(
            select(func.count()).select_from(Friendship).where(
                Friendship.friend_id == user_id, Friendship.status == "accepted"
            )
        )
        following_q = await self.db.execute(
            select(func.count()).select_from(Friendship).where(
                Friendship.user_id == user_id, Friendship.status == "accepted"
            )
        )
        return UserStats(
            reviews=reviews_q.scalar_one() or 0,
            visited=visited_q.scalar_one() or 0,
            followers=followers_q.scalar_one() or 0,
            following=following_q.scalar_one() or 0,
        )

    async def _get_badges(self, user_id: int) -> List[BadgeSummary]:
        result = await self.db.execute(
            select(Badge)
            .join(UserBadge, UserBadge.badge_id == Badge.id)
            .where(UserBadge.user_id == user_id)
        )
        badges = result.scalars().all()
        return [BadgeSummary(icon=b.icon, label=b.label, color=b.color) for b in badges]

    # ─── Public API ───────────────────────────────────────────────────────

    async def get_user_by_id(self, user_id: int) -> User:
        return await self._get_user_or_404(user_id)

    async def get_profile(self, user_id: int) -> UserProfile:
        user = await self._get_user_or_404(user_id)
        stats = await self._compute_stats(user_id)
        badges = await self._get_badges(user_id)
        return UserProfile(
            id=user.id,
            username=user.username,
            display_name=user.display_name,
            avatar_url=user.avatar_url,
            bio=user.bio,
            cover_url=user.cover_url,
            location=user.location,
            title=user.title,
            xp=user.xp,
            level=user.level,
            created_at=user.created_at,
            stats=stats,
            badges=badges,
        )

    async def get_me(self, user_id: int) -> UserMe:
        user = await self._get_user_or_404(user_id)
        stats = await self._compute_stats(user_id)
        badges = await self._get_badges(user_id)
        return UserMe(
            id=user.id,
            username=user.username,
            email=user.email,
            display_name=user.display_name,
            avatar_url=user.avatar_url,
            bio=user.bio,
            cover_url=user.cover_url,
            location=user.location,
            title=user.title,
            phone=user.phone,
            xp=user.xp,
            level=user.level,
            food_vector=list(user.food_vector) if user.food_vector is not None else None,
            place_vector=list(user.place_vector) if user.place_vector is not None else None,
            settings=user.settings or {},
            created_at=user.created_at,
            stats=stats,
            badges=badges,
        )

    async def update_me(self, user_id: int, data: UserUpdate) -> UserMe:
        user = await self._get_user_or_404(user_id)
        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(user, field, value)
        try:
            await self.db.commit()
            await self.db.refresh(user)
        except Exception as e:
            await self.db.rollback()
            raise HTTPException(status_code=400, detail=str(e))
        return await self.get_me(user_id)

    async def get_top_spots(self, user_id: int, limit: int = 3) -> list:
        from src.locations.models import Location
        # Join bookmarks → locations, sorted by rating desc
        result = await self.db.execute(
            select(Location)
            .join(Bookmark, Bookmark.location_id == Location.id)
            .where(Bookmark.user_id == user_id)
            .order_by(Location.rating.desc())
            .limit(limit)
        )
        locations = result.scalars().all()
        return [{"id": loc.id, "name": loc.name, "image_url": loc.image_url, "rating": loc.rating} for loc in locations]

    async def create_user(self, user_create: UserCreate) -> User:
        """
        Đăng ký người dùng mới.
        Migrate vector từ Redis (guest) nếu có device_id.
        """
        food_vector: List[float] = [0.5] * 15
        place_vector: List[float] = [0.5] * 15

        if user_create.device_id and self.redis:
            for domain, is_food in [("food", True), ("place", False)]:
                redis_key = f"user:{domain}:{user_create.device_id}"
                raw = await self.redis.get(redis_key)
                if raw:
                    data = json.loads(raw)
                    recovered = data.get("vector")
                    if recovered and len(recovered) == 15:
                        if is_food:
                            food_vector = [float(x) for x in recovered]
                        else:
                            place_vector = [float(x) for x in recovered]

        new_user = User(
            username=user_create.username,
            email=user_create.email,
            password_hash=user_create.password,
            food_vector=food_vector,
            place_vector=place_vector,
        )
        self.db.add(new_user)
        try:
            await self.db.commit()
            await self.db.refresh(new_user)
        except Exception as e:
            await self.db.rollback()
            raise HTTPException(status_code=400, detail=f"Không thể tạo người dùng: {str(e)}")

        if user_create.device_id and self.redis:
            for domain in ["food", "place"]:
                try:
                    await self.redis.delete(f"user:{domain}:{user_create.device_id}")
                except Exception:
                    pass

        return new_user
