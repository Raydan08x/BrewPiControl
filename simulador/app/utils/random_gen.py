"""Generadores aleatorios y funciones de simulación.

Todas las funciones están documentadas en español técnico.
"""
from __future__ import annotations

import math
import os
import random

# ---------------------------------------------------------------------------
# Parámetros configurables vía variables de entorno (.env)
# ---------------------------------------------------------------------------
TEMP_SIGMA: float = float(os.getenv("SIM_TEMP_SIGMA", 0.3))
PRESS_SIGMA: float = float(os.getenv("SIM_PRESS_SIGMA", 0.05))
CO2_SIGMA: float = float(os.getenv("SIM_CO2_SIGMA", 1.0))

# Duración (segundos) para que la curva logística alcance ~99 %
CO2_DURATION: float = float(os.getenv("SIM_CO2_DURATION", 7 * 24 * 60 * 60))


# ---------------------------------------------------------------------------
# Funciones utilitarias
# ---------------------------------------------------------------------------

def gaussian_bounded(value: float, minimo: float, maximo: float, sigma: float) -> float:
    """Aplica ruido gaussiano y limita el resultado dentro de un rango.

    Args:
        value: Valor actual.
        minimo: Límite inferior.
        maximo: Límite superior.
        sigma: Desviación estándar (ruido).
    """
    nuevo = value + random.gauss(0, sigma)
    return max(min(nuevo, maximo), minimo)


def logistic_0_100(elapsed: float) -> float:
    """Curva logística normalizada de 0 a 100 %.

    Args:
        elapsed: Tiempo transcurrido en segundos.
    """
    # Factor de pendiente tal que 99 % se alcance al final de la duración
    k = 12.0 / CO2_DURATION  # 12 ≈ pendiente típica para pasar de 1 % a 99 %
    x0 = CO2_DURATION / 2.0  # punto medio
    return 100.0 / (1 + math.e ** (-k * (elapsed - x0)))
