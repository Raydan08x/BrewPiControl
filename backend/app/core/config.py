""" 
Módulo de configuración
=======================
Carga variables de entorno para toda la aplicación.
"""

import os
from functools import lru_cache
from typing import Annotated

from pydantic import BaseModel, Field
from dotenv import load_dotenv

# Cargamos variables desde `.env` si existe
load_dotenv()


class Settings(BaseModel):
    """Modelo de configuración global usando Pydantic."""

    postgres_user: str = Field(env="POSTGRES_USER")
    postgres_password: str = Field(env="POSTGRES_PASSWORD")
    postgres_db: str = Field(env="POSTGRES_DB")
    postgres_host: str = Field(env="POSTGRES_HOST", default="database")
    postgres_port: int = Field(env="POSTGRES_PORT", default=5432)

    mqtt_host: str = Field(env="MQTT_BROKER_HOST", default="mqtt")
    mqtt_port: int = Field(env="MQTT_BROKER_PORT", default=1883)

    @property
    def database_dsn(self) -> str:
        """Devuelve la cadena DSN de conexión a PostgreSQL."""
        return (
            f"postgresql://{self.postgres_user}:{self.postgres_password}"
            f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )


@lru_cache()
def get_settings() -> Settings:  # noqa: D401
    """Devuelve la configuración cacheada (singleton)."""
    return Settings()
