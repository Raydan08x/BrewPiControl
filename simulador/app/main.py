"""Microservicio de simulación de fermentación para BrewPiControl.

Publica datos de temperatura, presión y CO₂ de cuatro fermentadores virtuales.
Se ejecuta indefinidamente dentro de un contenedor Docker.
"""
from __future__ import annotations

import signal
import sys
import time
from typing import List

from models.fermenter import Fermenter
from services.mqtt_client import MQTTClient

import os

PUBLISH_INTERVAL = float(os.getenv("SIM_PUBLISH_INTERVAL", 3.0))
FERMENTERS: List[Fermenter] = [
    Fermenter(f"FERMENTER_{i}") for i in range(1, 5)
]

mqtt_client = MQTTClient()


def graceful_shutdown(signo, _frame):
    print("[SIMULADOR] Señal de parada recibida, cerrando...")
    mqtt_client.disconnect()
    sys.exit(0)


# Registrar señales para terminar limpiamente
signal.signal(signal.SIGINT, graceful_shutdown)
signal.signal(signal.SIGTERM, graceful_shutdown)


def main() -> None:
    mqtt_client.connect()

    while True:
        start = time.time()

        # Actualizar estado y publicar mensajes de cada fermentador
        for fermenter in FERMENTERS:
            fermenter.step(PUBLISH_INTERVAL)
            mqtt_client.publish_many(fermenter.mqtt_messages())

        # Esperar hasta completar el intervalo de publicación
        elapsed = time.time() - start
        delay = max(PUBLISH_INTERVAL - elapsed, 0.0)
        time.sleep(delay)


if __name__ == "__main__":
    main()
