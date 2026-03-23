from sqlalchemy import Column, Integer, String
from pgvector.sqlalchemy import Vector
from src.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    
    # 15-dimensional vectors separated by domain
    # Mặc định [0.5]*15 (trung lập) — KHÔNG cho phép null
    # để tránh TypeError khi thuật toán tính U_new = U_old ± α·P
    food_vector = Column(Vector(15), nullable=False, default=[0.5] * 15)
    place_vector = Column(Vector(15), nullable=False, default=[0.5] * 15)
    
    # Gamification
    xp = Column(Integer, default=0)
    level = Column(Integer, default=1)
