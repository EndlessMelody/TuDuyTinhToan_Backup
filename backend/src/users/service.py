import json
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import redis.asyncio as aioredis
from typing import Optional, List

from src.users.models import User
from src.users.schemas import UserCreate


class UserService:
    def __init__(self, db: AsyncSession, redis: Optional[aioredis.Redis] = None):
        self.db = db
        self.redis = redis

    async def get_user_by_id(self, user_id: int) -> User:
        result = await self.db.execute(select(User).filter(User.id == user_id))
        user = result.scalars().first()
        if not user:
            raise HTTPException(status_code=404, detail="Không tìm thấy người dùng")
        return user

    async def create_user(self, user_create: UserCreate) -> User:
        """
        Đăng ký người dùng mới.
        
        LUỒNG QUAN TRỌNG — Guest → Registered:
        1. Nhận device_id từ request
        2. Tìm vector đang có trên Redis (guest đã vuốt nửa tiếng)
        3. Nếu có → gán vector đó vào User mới (không mất công "dạy AI")
        4. Nếu không có / hết hạn → dùng default [0.5]*15
        5. Xoá key Redis cũ của guest
        """
        # --- Bước 1: Tìm vector từ Redis nếu có device_id ---
        food_vector: List[float] = [0.5] * 15
        place_vector: List[float] = [0.5] * 15

        if user_create.device_id and self.redis:
            for domain, default_vec in [("food", food_vector), ("place", place_vector)]:
                redis_key = f"user:{domain}:{user_create.device_id}"
                raw = await self.redis.get(redis_key)
                if raw:
                    data = json.loads(raw)
                    recovered_vec = data.get("vector")
                    if recovered_vec and len(recovered_vec) == 15:
                        if domain == "food":
                            food_vector = [float(x) for x in recovered_vec]
                        else:
                            place_vector = [float(x) for x in recovered_vec]

        # --- Bước 2: Insert vào Postgres với vector thực ---
        new_user = User(
            username=user_create.username,
            email=user_create.email,
            password_hash=user_create.password,  # TODO: hash password trước khi lưu
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

        # --- Bước 3: Dọn dẹp Redis keys của guest ---
        if user_create.device_id and self.redis:
            for domain in ["food", "place"]:
                redis_key = f"user:{domain}:{user_create.device_id}"
                try:
                    await self.redis.delete(redis_key)
                except Exception:
                    pass  # Không crash nếu Redis lỗi

        return new_user
