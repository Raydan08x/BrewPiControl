""" 
Validadores y utilidades comunes
===============================
Contiene funciones de validación reutilizables en diferentes microservicios.
"""

from pydantic import BaseModel, ValidationError, validator


class Temperatura(BaseModel):
    """Valida valores de temperatura en °C."""

    valor: float

    @validator("valor")
    def rango_valido(cls, v: float) -> float:  # noqa: D401, N805
        if not (-40 <= v <= 150):
            raise ValueError("Temperatura fuera de rango seguro (-40 a 150 °C)")
        return v


def es_numero(texto: str) -> bool:
    """Retorna True si el texto representa un número flotante o entero."""
    try:
        float(texto)
    except ValueError:
        return False
    return True
