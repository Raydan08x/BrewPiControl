""" 
Módulo de sesión de base de datos
=================================
Define la fábrica de sesiones asíncronas usando SQLAlchemy 2.0.
"""

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import get_settings

settings = get_settings()

# URL async de SQLAlchemy (usa asyncpg como driver)
ASYNC_DSN = settings.database_dsn.replace("postgresql://", "postgresql+asyncpg://")

engine = create_async_engine(ASYNC_DSN, echo=False, future=True)

AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_db() -> AsyncSession:  # noqa: D401
    """Dependencia FastAPI para obtener una sesión de base de datos."""
    async with AsyncSessionLocal() as session:
        yield session
