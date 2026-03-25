from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from src.db.database import Base


class Group(Base):
    """
    Bảng Groups — đại diện một nhóm bạn bè cùng chọn địa điểm.
    Minimax algorithm sẽ hoạt động trên các member của group này.
    """
    __tablename__ = "groups"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

    # Status dùng String thay vì Enum — cùng triết lý với Interaction.action
    # Giá trị: "active", "completed", "cancelled"
    status = Column(String, nullable=False, default="active")

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    members = relationship("GroupMember", back_populates="group", lazy="selectin")


class GroupMember(Base):
    """
    Bảng GroupMember — liên kết N:N giữa User và Group.

    compromise_score: Lưu mức độ thuật toán Minimax đã "hy sinh" sở thích
    của user này trong quyết định trước. Nếu Member A bị compromise nhiều
    cho bữa trưa, weight của A sẽ được boost cho bữa tối.

    Công thức: min(max_i∈Group |Score_i - Score_ideal|)
    """
    __tablename__ = "group_members"

    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("groups.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    # Minimax memory: Boost weight cho user bị "thiệt" ở quyết định trước
    compromise_score = Column(Float, default=0.0)

    joined_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    group = relationship("Group", back_populates="members")
    user = relationship("User", back_populates="group_memberships")
