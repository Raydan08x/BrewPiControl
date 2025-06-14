"""Utilidad para crear todas las tablas en la base de datos.

Ejecutar dentro del contenedor backend:

```
docker compose exec backend python -m app.db.create_tables
```
"""
from __future__ import annotations

import asyncio
import logging

from sqlalchemy.ext.asyncio import AsyncEngine

from app.db.session import engine  # noqa: WPS433 (import inside pkg)

# Importar todos los modelos para que SQLAlchemy registre la metadata
from app.models import fermentation  # noqa: F401
from app.inventory import models as inventory_models  # noqa: F401
from app.providers import models as provider_models  # noqa: F401

logger = logging.getLogger(__name__)


aSyncEngine = AsyncEngine  # alias para tipo


async def _create_all(db_engine: aSyncEngine) -> None:
    async with db_engine.begin() as conn:
        logger.info("Creando tablas si no existen…")
        await conn.run_sync(fermentation.Base.metadata.create_all)
        await conn.run_sync(inventory_models.Base.metadata.create_all)
        await conn.run_sync(provider_models.Base.metadata.create_all)
        logger.info("Tablas creadas o ya existentes.")


def main() -> None:  # noqa: D401
    """Punto de entrada sincrónico."""
    asyncio.run(_create_all(engine))


if __name__ == "__main__":
    main()
