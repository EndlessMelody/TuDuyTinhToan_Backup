from sqlalchemy import Column, Integer, String, DateTime, func
from pgvector.sqlalchemy import Vector
from sqlalchemy.orm import relationship
from src.db.database import Base


class User(Base):
    """
    Bảng Users — lưu trữ thông tin người dùng và vector sở thích 15 chiều.
    Vector mặc định [0.5]*15 (trung lập) để thuật toán U_new = U_old ± α·P
    không bị TypeError khi user mới chưa có dữ liệu.
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=True)  # Nullable cho giai đoạn chưa có auth
    display_name = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)

    # 15-dimensional preference vectors (separated by domain)
    food_vector = Column(Vector(15), nullable=False, default=[0.5] * 15)
    place_vector = Column(Vector(15), nullable=False, default=[0.5] * 15)

    # Gamification
    xp = Column(Integer, default=0)
    level = Column(Integer, default=1)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships — existing
    interactions = relationship("Interaction", back_populates="user", lazy="selectin")
    group_memberships = relationship("GroupMember", back_populates="user", lazy="selectin")

    # Relationships — new social features
    posts = relationship("Post", back_populates="user", lazy="selectin")
    reels = relationship("Reel", back_populates="user", lazy="selectin")
    post_likes = relationship("PostLike", back_populates="user", lazy="selectin")
    comments = relationship("Comment", back_populates="user", lazy="selectin")
    friendships_sent = relationship("Friendship", foreign_keys="Friendship.user_id", back_populates="user", lazy="selectin")
    friendships_received = relationship("Friendship", foreign_keys="Friendship.friend_id", back_populates="friend", lazy="selectin")
    tours = relationship("Tour", back_populates="user", lazy="selectin")
    bookmarks = relationship("Bookmark", back_populates="user", lazy="selectin")
    notifications = relationship("Notification", back_populates="user", lazy="selectin")
