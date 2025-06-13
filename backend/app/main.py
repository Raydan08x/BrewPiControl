""" 
Módulo principal de la API FastAPI
==================================
Este archivo define la aplicación FastAPI y registra las rutas principales.
Toda la documentación y comentarios están en español técnico.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import status
import asyncio
from app.services.mqtt import mqtt_manager

# Creamos la instancia principal de FastAPI
app = FastAPI(
    title="BrewPi Control API",
    description="API SCADA industrial para control de planta cervecera.",
    version="0.0.1",
)

# Configuramos CORS para permitir acceso desde el frontend HMI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: restringir en producción a dominios específicos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluimos los routers de la aplicación
app.include_router(status.router, prefix="/api")


@app.on_event("startup")
async def startup_event() -> None:
    """Arranca la tarea de escucha MQTT en segundo plano."""
    asyncio.create_task(mqtt_manager.run_forever())


@app.on_event("shutdown")
async def shutdown_event() -> None:
    """Cierra la conexión MQTT al finalizar la aplicación."""
    await mqtt_manager.disconnect()
