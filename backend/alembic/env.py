import sys
import os
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool, MetaData
from alembic import context

# Add app directory to sys.path - adjusted for Docker container
sys.path.append('/app')

# Importar todas las bases de los diferentes módulos
from app.models.fermentation import Base as FermentationBase
from app.inventory.models import Base as InventoryBase
from app.providers.models import Base as ProviderBase

# Obtener la URL de conexión a la base de datos
from app.core.config import get_settings
settings = get_settings()
SQLALCHEMY_DATABASE_URL = settings.database_dsn

# Alembic Config object
config = context.config
fileConfig(config.config_file_name)

# Combinar las metadatas de todas las clases Base
metadata_list = [
    FermentationBase.metadata,
    InventoryBase.metadata,
    ProviderBase.metadata
]

# Crear metadata combinada para Alembic
combined_metadata = MetaData()
for metadata in metadata_list:
    for table in metadata.tables.values():
        # Evitar duplicados de tablas
        if table.name not in combined_metadata.tables:
            table.tometadata(combined_metadata)

target_metadata = combined_metadata

def run_migrations_offline():
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url, target_metadata=target_metadata, literal_binds=True, compare_type=True
    )
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata, compare_type=True
        )
        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
