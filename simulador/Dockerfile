# Dockerfile del Simulador de Planta
# ----------------------------------
# Utilizamos Python 3.11 slim para correr un simulador sencillo basado en asyncio.

FROM python:3.11-slim

WORKDIR /sim

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY ./app ./app

CMD ["python", "-m", "app.main"]
