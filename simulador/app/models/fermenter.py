"""Modelo de datos para un fermentador virtual.

Este modelo encapsula el estado de proceso de fermentación y provee métodos
para actualizar sus variables y publicarlas vía MQTT.
"""
from __future__ import annotations

import time
import os

from ..utils.random_gen import gaussian_bounded, logistic_0_100

# ---------------------------------------------------------------------------
# Parámetros globales configurables vía variables de entorno (.env)
# ---------------------------------------------------------------------------
TEMP_MIN: float = float(os.getenv("SIM_TEMP_MIN", 18.0))
TEMP_MAX: float = float(os.getenv("SIM_TEMP_MAX", 22.0))
TEMP_SIGMA: float = float(os.getenv("SIM_TEMP_SIGMA", 0.3))

PRESS_MIN: float = float(os.getenv("SIM_PRESS_MIN", 0.8))
PRESS_MAX: float = float(os.getenv("SIM_PRESS_MAX", 1.2))
PRESS_SIGMA: float = float(os.getenv("SIM_PRESS_SIGMA", 0.05))

CO2_SIGMA: float = float(os.getenv("SIM_CO2_SIGMA", 1.0))


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

        # Temperatura con ruido gaussiano
        self.temperature = gaussian_bounded(self.temperature, TEMP_MIN, TEMP_MAX, TEMP_SIGMA)

        # Presión con ruido gaussiano
        self.pressure = gaussian_bounded(self.pressure, PRESS_MIN, PRESS_MAX, PRESS_SIGMA)

        # CO₂ basada en curva logística con ruido adicional
        base_co2 = logistic_0_100(elapsed)
        self.co2 = gaussian_bounded(base_co2, 0.0, 100.0, CO2_SIGMA)

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
