# Dockerfile del Backend FastAPI
# ---------------------------------
# Imagen base ligera con Python 3.11
FROM python:3.11-slim

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos el archivo de dependencias primero para aprovechar la cache de Docker
COPY requirements.txt ./

# Instalamos dependencias necesarias para FastAPI y MQTT
RUN pip install --no-cache-dir -r requirements.txt

# Copiamos el código fuente de la aplicación
COPY ./app ./app

# Copiamos el archivo de variables de entorno de ejemplo
COPY .env.example .env

# Exponemos el puerto por defecto de Uvicorn (FastAPI)
EXPOSE 8000

# Comando de arranque de la API
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
