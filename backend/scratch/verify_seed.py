import asyncio
from sqlalchemy.future import select
from sqlalchemy import func
from src.db.database import AsyncSessionLocal
from src.challenges.models import Challenge

async def count_challenges():
    async with AsyncSessionLocal() as session:
        count = await session.scalar(select(func.count(Challenge.id)))
        print(f"Total challenges in DB: {count}")

if __name__ == "__main__":
    asyncio.run(count_challenges())
