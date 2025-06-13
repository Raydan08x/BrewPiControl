"""Modelo de datos para un fermentador virtual.

Este modelo encapsula el estado de proceso de fermentación y provee métodos
para actualizar sus variables y publicarlas vía MQTT.
"""
from __future__ import annotations

import time

from ..utils.random_generators import random_walk, curva_logistica


class Fermenter:
    """Representa un fermentador y su proceso de fermentación."""

    def __init__(self, fermenter_id: str) -> None:
        self.id = fermenter_id
        self._start_ts = time.time()

        # Variables iniciales (pueden ajustarse según receta)
        self.temperature = 20.0  # °C
        self.pressure = 1.0  # bar
        self.co2 = 0.0  # %

    # ---------------------------------------------------------------------
    # Métodos de simulación
    # ---------------------------------------------------------------------
    def step(self, interval: float) -> None:
        """Actualiza los valores del fermentador.

        Args:
            interval: Intervalo de tiempo entre iteraciones (segundos).
        """
        # Tiempo total transcurrido
        elapsed = time.time() - self._start_ts

        # Temperatura se mantiene entre 18-22 °C con variaciones lentas
        self.temperature = random_walk(self.temperature, 18.0, 22.0, paso=0.05)

        # Presión se mantiene entre 0.8-1.2 bar con variación suave
        self.pressure = random_walk(self.pressure, 0.8, 1.2, paso=0.01)

        # CO₂ sigue una curva logística hasta 100 % con algo de ruido
        base_co2 = curva_logistica(elapsed)
        self.co2 = random_walk(base_co2, 0.0, 100.0, paso=1.0)

    # ------------------------------------------------------------------
    # Serialización
    # ------------------------------------------------------------------
    def mqtt_messages(self) -> list[tuple[str, str]]:
        """Devuelve los mensajes MQTT a publicar para este fermentador."""
        base_topic = f"brewpi/fermentation/{self.id}"
        return [
            (f"{base_topic}/temperature", f"{self.temperature:.2f}"),
            (f"{base_topic}/pressure", f"{self.pressure:.3f}"),
            (f"{base_topic}/co2", f"{self.co2:.1f}"),
        ]
