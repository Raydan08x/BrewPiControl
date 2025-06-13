""" 
Módulo principal de la API FastAPI
==================================
Este archivo define la aplicación FastAPI y registra las rutas principales.
Toda la documentación y comentarios están en español técnico.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import routers as app_routers

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

# Incluimos todos los routers declarados
for rtr in app_routers:
    app.include_router(rtr, prefix="/api")



