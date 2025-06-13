"""Servicio de conexión MQTT usando paho-mqtt."""
from __future__ import annotations

import os
from typing import Iterable, Tuple

import paho.mqtt.client as mqtt
from dotenv import load_dotenv

load_dotenv()

MQTT_HOST = os.getenv("MQTT_BROKER_HOST", "mqtt")
MQTT_PORT = int(os.getenv("MQTT_BROKER_PORT", 1883))
MQTT_USERNAME = os.getenv("MQTT_USERNAME")
MQTT_PASSWORD = os.getenv("MQTT_PASSWORD")


class MQTTClient:
    """Wrapper simple sobre `paho.mqtt.client.Client`."""

    def __init__(self) -> None:
        self._client = mqtt.Client()
        if MQTT_USERNAME and MQTT_PASSWORD:
            self._client.username_pw_set(MQTT_USERNAME, MQTT_PASSWORD)

    # ------------------------------------------------------------------
    # API pública
    # ------------------------------------------------------------------
    def connect(self) -> None:
        self._client.connect(MQTT_HOST, MQTT_PORT)
        # Inicia el loop en segundo plano para manejar reconexiones
        self._client.loop_start()
        print(f"[MQTT] Conectado a {MQTT_HOST}:{MQTT_PORT}")

    def publish_many(self, messages: Iterable[Tuple[str, str]]) -> None:
        """Publica múltiples mensajes (topic, payload)."""
        for topic, payload in messages:
            self._client.publish(topic, payload)
            print(f"[MQTT] {topic} <- {payload}")

    def disconnect(self) -> None:
        self._client.loop_stop()
        self._client.disconnect()
