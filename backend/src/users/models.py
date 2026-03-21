from sqlalchemy import Column, Integer, String
from pgvector.sqlalchemy import Vector
from src.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    
    # 15-dimensional vector for user preferences
    preferences_vector = Column(Vector(15))
