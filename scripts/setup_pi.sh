#!/usr/bin/env bash
# Script de instalación rápida en Raspberry Pi
set -euo pipefail
PROJECT_DIR="$(dirname "$(dirname "$0")")"
cd "$PROJECT_DIR"

# Copiar archivo .env si no existe
if [ ! -f backend/.env ]; then
  echo "Copiando backend/.env desde el ejemplo…"
  cp backend/.env.example backend/.env
fi

# Construir y levantar contenedores
DockerCompose="docker compose"
$DockerCompose pull --ignore-pull-failures || true
$DockerCompose build
$DockerCompose up -d

# Esperar a que la BD esté lista
echo "Esperando a PostgreSQL…"
$DockerCompose exec -T database bash -c 'until pg_isready -U "$POSTGRES_USER"; do sleep 1; done'

# Crear tablas
echo "Creando tablas…"
$DockerCompose exec -T backend python -m app.db.create_tables

# Importar archivo de ejemplo si aún no existe algún lote
COUNT=$($DockerCompose exec -T backend bash -c "python - <<'PY'
from sqlalchemy import select
from app.db.session import AsyncSessionLocal
from app.inventory.models import InventoryItem
import asyncio
async def main():
    async with AsyncSessionLocal() as db:
        qty = await db.scalar(select(InventoryItem).count())
        print(qty or 0)
asyncio.run(main())
PY")
if [ "$COUNT" = "0" ]; then
  echo "Importando CSV de ejemplo…"
  curl -s -F file=@docs/samples/inventory_sample.csv http://localhost:8000/api/inventory/import || true
fi

echo "BrewPiControl listo en http://localhost:8080"
