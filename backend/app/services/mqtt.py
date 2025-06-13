""" 
Cliente MQTT Asíncrono
======================
Gestiona la conexión al broker y permite suscripción/publicación centralizada.
Se integra con FastAPI mediante eventos de startup/shutdown.
"""

import asyncio
import logging
from collections.abc import AsyncIterator, Callable
from typing import Awaitable

from asyncio_mqtt import Client, MqttError

from app.core.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


class MQTTManager:
    """Gestor de conexión MQTT singleton."""

    def __init__(self) -> None:
        self._client: Client | None = None
        self._listeners: list[Callable[[str, bytes], Awaitable[None]]] = []

    async def connect(self) -> None:
        """Establece conexión con el broker."""
        self._client = Client(settings.mqtt_host, settings.mqtt_port)
        await self._client.connect()
        logger.info("Conectado al broker MQTT %s:%s", settings.mqtt_host, settings.mqtt_port)

    async def disconnect(self) -> None:
        """Cierra la conexión MQTT si está abierta."""
        if self._client is not None:
            await self._client.disconnect()
            logger.info("Desconexión del broker MQTT")

    async def subscribe(self, topic: str) -> None:
        """Se suscribe a un tópico dado."""
        if self._client is None:
            raise RuntimeError("Cliente MQTT no conectado")
        await self._client.subscribe(topic)
        logger.debug("Suscrito a tópico %s", topic)

    async def publish(self, topic: str, payload: str | bytes) -> None:
        """Publica un mensaje en un tópico."""
        if self._client is None:
            raise RuntimeError("Cliente MQTT no conectado")
        await self._client.publish(topic, payload)
        logger.debug("Publicado en %s: %s", topic, payload)

    def add_listener(self, callback: Callable[[str, bytes], Awaitable[None]]) -> None:
        """Registra un callback para mensajes entrantes."""
        self._listeners.append(callback)

    async def _message_loop(self) -> None:
        """Escucha mensajes entrantes y envía a los listeners."""
        assert self._client is not None
        async with self._client.unfiltered_messages() as messages:
            await self._client.subscribe("#")  # Suscribirse a todo (ajustar según necesidad)
            async for msg in messages:
                for listener in self._listeners:
                    await listener(msg.topic, msg.payload)

    async def run_forever(self) -> None:
        """Bucle principal para mantener alive la conexión y reintentar en errores."""
        reconnect_interval = 5  # segundos
        while True:
            try:
                await self.connect()
                await self._message_loop()
            except MqttError as exc:
                logger.warning("Error MQTT: %s, reconectando en %s s", exc, reconnect_interval)
                await asyncio.sleep(reconnect_interval)


mqtt_manager = MQTTManager()
