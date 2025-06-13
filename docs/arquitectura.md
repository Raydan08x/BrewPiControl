# Arquitectura SCADA BrewPi Control v0.0.1 Industrial

## 1. Descripción General
El sistema SCADA está compuesto por microservicios independientes, comunicados por una red privada Docker y un broker MQTT industrial, lo que permite escalabilidad, portabilidad y operación autónoma en una LAN local sin dependencia de internet.

## 2. Componentes Principales
- **Backend FastAPI**: Control central, lógica de negocio, API REST externa, integración MQTT, gestión de lotes y alarmas.
- **Frontend SCADA HMI**: Interfaz gráfica industrial basada en canvas 2D, visualización en tiempo real, optimizada para pantallas táctiles de 7” (Raspberry Pi 5).
- **Broker MQTT Mosquitto**: Comunicación bidireccional SCADA ↔ PLCs ESP32-S3.
- **Base de Datos PostgreSQL**: Registro industrial, trazabilidad y cumplimiento normativo.
- **Simulador de Planta**: Validación de lógicas y procesos sin hardware físico.
- **PLCs ESP32-S3**: Controladores autónomos por zona, programados en MicroPython, con lógica fail-safe.

## 3. Diagrama de Alto Nivel
```
+---------------------+       +-----------------+       +---------------------+
|    Frontend HMI     | <---> |   Backend API   | <---> |    PostgreSQL DB    |
| (Docker, Canvas 2D) |       | (FastAPI, MQTT) |       | (Docker, Persist.)  |
+---------------------+       +-----------------+       +---------------------+
         |                               ^
         |                               |
         v                               |
+---------------------+       +---------------------+       +---------------------+
|   Planta Virtual    | <---> |   Broker MQTT       | <---> |   PLCs ESP32-S3     |
|   (Simulador)       |       | (Mosquitto Docker)  |       | (MicroPython, WiFi) |
+---------------------+       +---------------------+       +---------------------+
```

## 4. Flujo de Datos
1. Los PLCs ESP32-S3 publican y reciben datos vía MQTT (Mosquitto).
2. El backend recibe, procesa y almacena los datos en PostgreSQL.
3. El frontend consulta el backend y visualiza el estado de la planta en tiempo real.
4. El simulador puede emular el comportamiento de la planta para pruebas y validaciones.

## 5. Seguridad y Normativas
- Interlocks industriales y alarmas de proceso.
- Registro completo de lotes y parámetros críticos.
- Cumplimiento HACCP, INVIMA, BPM e ISO 9001.
