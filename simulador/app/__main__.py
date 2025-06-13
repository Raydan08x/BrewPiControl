""" 
Módulo principal del simulador de planta
=======================================
Este simulador publica datos ficticios vía MQTT para probar la API y el HMI sin
necesidad de hardware físico.
"""

import asyncio
import os
import random

from asyncio_mqtt import Client
from dotenv import load_dotenv

# Cargamos variables de entorno
load_dotenv()

MQTT_HOST = os.getenv("MQTT_BROKER_HOST", "mqtt")
MQTT_PORT = int(os.getenv("MQTT_BROKER_PORT", "1883"))

# Lista de tópicos de ejemplo (temperatura, presión, etc.)
TOPICS = [
    ("planta/coccion/temperatura", lambda: random.uniform(60, 100)),
    ("planta/fermentacion/temperatura", lambda: random.uniform(18, 25)),
    ("planta/fermentacion/presion", lambda: random.uniform(0.9, 1.2)),
]

PUBLISH_INTERVAL = 2  # segundos


async def publicar_datos(cliente: Client) -> None:
    """Publica datos simulados en los tópicos MQTT."""
    while True:
        for topic, generator in TOPICS:
            valor = generator()
            payload = f"{valor:.2f}"
            await cliente.publish(topic, payload)
            print(f"[SIMULADOR] Publicado {payload} en {topic}")
        await asyncio.sleep(PUBLISH_INTERVAL)


async def main() -> None:
    """Función principal asincrónica del simulador."""
    async with Client(MQTT_HOST, MQTT_PORT) as client:
        print("[SIMULADOR] Conectado al broker MQTT")
        await publicar_datos(client)


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("[SIMULADOR] Detenido por el usuario")
