"""Servicio de negocio para el subsistema de fermentación.

Contiene funciones CRUD y la lógica para procesar mensajes MQTT entrantes.
"""
from __future__ import annotations

import asyncio
import datetime as dt
import re
from typing import List

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.fermentation import FermentationReading, FermentationTank
from app.services.mqtt import mqtt_manager

# Patrón de tópico esperado
TOPIC_REGEX = re.compile(r"brewpi/fermentation/(?P<tank_id>[^/]+)/(?P<var>temperature|pressure|co2)")


class FermentationService:  # pylint: disable=too-few-public-methods
    """Servicio singleton para manejar operaciones de fermentación."""

    def __init__(self) -> None:
        # buffer temporal: {tank_id: {var: valor}}
        self._buffer: dict[str, dict[str, float]] = {}
        # task para flush periódico
        self._flush_task: asyncio.Task | None = None

    # ---------------------------------------------------------------------
    # API pública
    # ---------------------------------------------------------------------
    async def list_tanks(self, db: AsyncSession) -> List[FermentationTank]:
        stmt = select(FermentationTank)
        result = await db.execute(stmt)
        return result.scalars().all()

    async def assign_profile(self, db: AsyncSession, tank_id: str, profile_name: str) -> None:
        tank = await db.get(FermentationTank, tank_id)
        if not tank:
            tank = FermentationTank(id=tank_id, name=tank_id)
            db.add(tank)
        tank.profile = profile_name
        await db.commit()

    async def get_history(self, db: AsyncSession, tank_id: str, limit: int = 2880):
        # devuelve últimas 2 días a 1 lectura/min por defecto
        stmt = (
            select(FermentationReading)
            .where(FermentationReading.tank_id == tank_id)
            .order_by(FermentationReading.timestamp.desc())
            .limit(limit)
        )
        result = await db.execute(stmt)
        return list(reversed(result.scalars().all()))

    # ------------------------------------------------------------------
    # MQTT
    # ------------------------------------------------------------------
    async def _mqtt_listener(self, topic: str, payload: bytes) -> None:
        match = TOPIC_REGEX.fullmatch(topic)
        if not match:
            return
        tank_id = match.group("tank_id")
        var = match.group("var")
        try:
            value = float(payload.decode())
        except ValueError:
            return
        self._buffer.setdefault(tank_id, {})[var] = value

    async def _flush_loop(self) -> None:
        """Cada segundo escribe los datos completos recibidos en la BD."""
        async for db in get_db():  # type: ignore[misc]
            while True:
                await asyncio.sleep(1)
                if not self._buffer:
                    continue
                now = dt.datetime.utcnow()
                for tank_id, values in list(self._buffer.items()):
                    if {"temperature", "pressure", "co2"}.issubset(values.keys()):
                        reading = FermentationReading(
                            tank_id=tank_id,
                            timestamp=now,
                            temperature=values["temperature"],
                            pressure=values["pressure"],
                            co2=values["co2"],
                        )
                        db.add(reading)
                        # Ensure tank exists
                        tank = await db.get(FermentationTank, tank_id)
                        if not tank:
                            db.add(FermentationTank(id=tank_id, name=tank_id))
                        del self._buffer[tank_id]
                await db.commit()

    def setup(self) -> None:
        mqtt_manager.add_listener(self._mqtt_listener)
        self._flush_task = asyncio.create_task(self._flush_loop())


fermentation_service = FermentationService()
