"""
Router de Estado (Status)
=========================
Este router proporciona un endpoint sencillo para verificar que la API se encuentra
operativa. Es útil para monitoreo y pruebas de conectividad.
"""

from fastapi import APIRouter

router = APIRouter()


@router.get("/status", summary="Estado del sistema", tags=["Status"])
async def status() -> dict[str, str]:
    """Endpoint de salud de la API.

    Returns
    -------
    dict[str, str]
        Un mensaje indicando que la API está en funcionamiento.

@router.get("/status/ping", summary="Ping healthcheck", tags=["Status"])
async def ping() -> dict:
    return {"pong": True}
