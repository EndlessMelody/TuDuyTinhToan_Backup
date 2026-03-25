from sqlalchemy import Column, Integer, String, Float, Index
from sqlalchemy.dialects.postgresql import JSONB
from pgvector.sqlalchemy import Vector
from sqlalchemy.orm import relationship
from src.db.database import Base


class Location(Base):
    """
    Bảng Locations — lưu trữ các POI (Point of Interest).
    Vector 15 chiều biểu diễn đặc trưng địa điểm cho thuật toán Cosine Similarity.
    characteristics dùng JSONB thay vì JSON thường để hỗ trợ GIN index sau này.
    """
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)

    # Vector features: 15 dimensions (price, noise, nature, food_type, modern_vs_historic, ...)
    vector = Column(Vector(15))

    # Spatial info
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)

    # Geographic bucketing (cho query theo khu vực)
    address = Column(String, nullable=True)
    city = Column(String, nullable=True, index=True)

    # Context features
    base_score = Column(Float, default=0.0)
    category = Column(String, index=True)  # "food" / "place"
    image_url = Column(String, nullable=True)

    # JSONB thay vì JSON: hỗ trợ GIN index, query nhanh hơn
    # Ví dụ: {"vibe": "chill", "price_range": "$$$", "cuisine": "Vietnamese"}
    characteristics = Column(JSONB, nullable=True)

    # Relationships
    interactions = relationship("Interaction", back_populates="location", lazy="selectin")

    # Index cho pgvector ANN search (ivfflat hoặc hnsw) — sẽ tạo qua Alembic raw SQL
    # vì SQLAlchemy chưa hỗ trợ native CREATE INDEX ... USING ivfflat
