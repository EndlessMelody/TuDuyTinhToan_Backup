from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from pgvector.sqlalchemy import Vector
from src.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    
    # Profile info
    name = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    avatar = Column(String, nullable=True)  # URL to avatar image
    cover = Column(String, nullable=True)    # URL to cover image
    title = Column(String, nullable=True)    # User title/rank name
    location = Column(String, nullable=True) # User location
    phone = Column(String, nullable=True)    # Phone number
    joined_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # 15-dimensional vectors separated by domain
    # Mặc định [0.5]*15 (trung lập) — KHÔNG cho phép null
    # để tránh TypeError khi thuật toán tính U_new = U_old ± α·P
    food_vector = Column(Vector(15), nullable=False, default=[0.5] * 15)
    place_vector = Column(Vector(15), nullable=False, default=[0.5] * 15)
    
    # Authentication
    password_hash = Column(String, nullable=True)
    
    # Gamification
    xp = Column(Integer, default=0)
    level = Column(Integer, default=1)
