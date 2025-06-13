# BrewPi Control v0.0.1 Industrial — Sierra Dorada Automation Suite 4.0 (Docker + PLC Edition)

## Descripción
Sistema SCADA industrial modular y distribuido para control integral de plantas cerveceras industriales, basado en microservicios Docker y arquitectura descentralizada.

## Componentes
- Backend FastAPI (control central, API, lógica de negocio)
- Frontend SCADA HMI (canvas 2D interactivo)
- Broker MQTT Mosquitto (comunicación industrial)
- Base de datos PostgreSQL (registro y trazabilidad)
- Simulador de planta virtual
- PLCs ESP32-S3 (controladores autónomos por zona)

## Objetivos
- Automatización y control de procesos cerveceros
- Modularidad y escalabilidad
- Operación en LAN local aislada (sin internet)
- Portabilidad PC local ↔ Raspberry Pi 5

## Instalación Rápida
```bash
# Requisitos: Docker y Docker Compose instalados
git clone <REPO_URL>
cd BrewPiControl
docker-compose up -d
```

## Documentación completa en `/docs`
