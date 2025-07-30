from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from .base import Base
from ..core.config import settings

engine = create_async_engine(settings.database_url, echo=False, pool_size=20, max_overflow=40)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
