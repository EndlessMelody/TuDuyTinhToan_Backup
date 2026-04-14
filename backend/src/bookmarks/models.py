from sqlalchemy import Column, Integer, DateTime, ForeignKey, UniqueConstraint, func
from sqlalchemy.orm import relationship
from src.db.database import Base


class Bookmark(Base):
    """
    Bảng Bookmarks — "The Taste Vault" trong frontend.
    User lưu địa điểm yêu thích, nhận XP khi bookmark.
    Unique constraint (user_id, location_id) tránh bookmark trùng lặp.
    """
    __tablename__ = "bookmarks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    location_id = Column(Integer, ForeignKey("locations.id", ondelete="CASCADE"), nullable=False, index=True)

    # XP thưởng khi lưu địa điểm vào Vault
    xp_earned = Column(Integer, default=0)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="bookmarks")
    location = relationship("Location", back_populates="bookmarks")

    __table_args__ = (
        UniqueConstraint("user_id", "location_id", name="uq_bookmark"),
    )
