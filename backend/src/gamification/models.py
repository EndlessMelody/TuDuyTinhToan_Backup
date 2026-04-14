from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, UniqueConstraint, func
from sqlalchemy.orm import relationship
from src.db.database import Base


class Badge(Base):
    """
    Bảng Badges — danh sách huy hiệu có thể nhận.
    VD: 🔥 Spice Master, 🌙 Night Owl, 📸 Photo Pro, 👑 Top Reviewer
    """
    __tablename__ = "badges"

    id = Column(Integer, primary_key=True, index=True)
    icon = Column(String, nullable=False)     # Emoji: "🔥", "🌙", "📸", "👑"
    label = Column(String, nullable=False)    # "Spice Master", "Night Owl"
    color = Column(String, nullable=False)    # Hex: "#E63946", "#7B2FF7"
    description = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user_badges = relationship("UserBadge", back_populates="badge", lazy="selectin")


class UserBadge(Base):
    """
    Bảng UserBadges — liên kết N:N giữa User và Badge.
    Unique constraint (user_id, badge_id) tránh nhận trùng badge.
    """
    __tablename__ = "user_badges"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    badge_id = Column(Integer, ForeignKey("badges.id", ondelete="CASCADE"), nullable=False, index=True)

    earned_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="user_badges")
    badge = relationship("Badge", back_populates="user_badges")

    __table_args__ = (
        UniqueConstraint("user_id", "badge_id", name="uq_user_badge"),
    )
