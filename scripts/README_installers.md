# Instaladores Automáticos

Este directorio contiene scripts de instalación y despliegue para distintos entornos.

| Script | Plataforma | Descripción |
|--------|------------|-------------|
| `install_brewpi_rpi.sh` | Raspberry Pi 5 (ARM64) | Instala Docker Engine + Compose, clona/actualiza el repositorio y levanta los contenedores. |

## Uso rápido en Raspberry Pi

```bash
curl -fsSL https://raw.githubusercontent.com/tuusuario/BrewPiControl/main/scripts/install_brewpi_rpi.sh | bash
```

El script solicita contraseña sudo la primera vez, añade al usuario al grupo `docker` y expone la API en `http://<IP>:8000/docs` y el HMI en `http://<IP>:8080`.

---

> Próximamente: instaladores `.exe` o `.msi` para Windows (desarrollo), paquetes `.deb` para Debian/Ubuntu y playbooks Ansible para despliegue masivo.
