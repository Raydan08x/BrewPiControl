# Guía de Instalación — BrewPi Control v0.0.1 Industrial

## 1. Requisitos Previos
- Docker 24+ y Docker Compose 2.20+
- Git
- PC (Windows/Linux/macOS) ó Raspberry Pi 5 (ARM64)

## 2. Clonar Repositorio
```bash
git clone <REPO_URL>
cd BrewPiControl
```

## 3. Variables de Entorno
Copiar `.env.example` a `.env` en cada microservicio y ajustar credenciales si es necesario.

## 4. Levantar Servicios (Desarrollo Local)
```bash
docker-compose up -d --build
```

Accede a:
- Backend API: `http://localhost:8000/docs`
- Frontend HMI: `http://localhost:8080`
- Broker MQTT: `mqtt://localhost:1883`
- Base de datos: `localhost:5432` (usuario: brewadmin, contraseña: brewpass)

## 5. Despliegue en Raspberry Pi 5
1. Instalar Docker y Docker Compose ARM64.
2. Transferir el proyecto (`scp` o `git clone`).
3. Ejecutar `docker-compose up -d --build`.

## 6. Estructura de Carpetas Importante
```
backend/     -> Backend FastAPI, Dockerfile, requirements.txt
frontend/    -> HMI, Dockerfile, assets, src/
mqtt/        -> mosquitto.conf y volúmenes
simulador/   -> Código de simulador y Dockerfile
database/    -> Scripts de inicialización y datos persistentes
```

## 7. Actualización del Sistema
```bash
git pull
docker-compose pull
docker-compose up -d --build
```

## 8. Resolución de Problemas
- Ver logs de un servicio: `docker logs -f <nombre_contenedor>`
- Acceder a contenedor: `docker exec -it <nombre_contenedor> /bin/bash`

## 9. Créditos
Desarrollado por Sierra Dorada Automation Suite 4.0.
