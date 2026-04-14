from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from src.db.database import Base


class Reel(Base):
    """
    Bảng Reels — video ngắn về food/location trong Trending Reels section.
    views_count, likes_count, comments_count là denormalized counters.
    """
    __tablename__ = "reels"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    title = Column(String, nullable=False)
    video_url = Column(String, nullable=True)
    thumbnail_url = Column(String, nullable=True)

    # Denormalized counters
    views_count = Column(Integer, default=0)
    likes_count = Column(Integer, default=0)
    comments_count = Column(Integer, default=0)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="reels")
    comments = relationship("Comment", back_populates="reel", lazy="selectin")
