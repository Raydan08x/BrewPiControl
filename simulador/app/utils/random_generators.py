"""Utilidades para generar valores aleatorios controlados.

Todas las funciones están documentadas en español técnico para facilitar el
mantenimiento por parte del equipo de automatización.
"""
from __future__ import annotations

import random
import math


def random_walk(value: float, minimo: float, maximo: float, paso: float = 0.2) -> float:
    """Genera un nuevo valor aplicando un *random walk* acotado.

    Args:
        value: Valor actual.
        minimo: Límite inferior permitido.
        maximo: Límite superior permitido.
        paso: Variación máxima que se aplica en cada iteración.

    Returns:
        float: Nuevo valor dentro de los límites especificados.
    """
    nuevo_valor = value + random.uniform(-paso, paso)
    return max(min(nuevo_valor, maximo), minimo)


def curva_logistica(t: float, k: float = 0.03, x0: float = 2000) -> float:
    """Calcula una curva logística normalizada (0-100).

    Se utiliza para simular la generación de CO₂ en una fermentación típica.

    Args:
        t: Tiempo transcurrido (segundos) desde el inicio de la fermentación.
        k: Constante de crecimiento.
        x0: Punto de inflexión.
    """
    return 100.0 / (1 + math.e ** (-k * (t - x0)))
