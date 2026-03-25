from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base

from src.core.config import settings

engine = create_async_engine(settings.DATABASE_URL, echo=False)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

# Import toàn bộ Models ở cuối file để Base đăng ký đầy đủ vào Registry
# Tránh lỗi InvalidRequestError khi SQLAlchemy mapper khởi tạo Class
from src.users.models import User
from src.locations.models import Location
from src.interactions.models import Interaction
from src.groups.models import Group, GroupMember
