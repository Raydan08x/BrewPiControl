#!/usr/bin/env bash
# -----------------------------------------------------------------------------
# Script de instalación automática para Raspberry Pi 5 (ARM64)
# BrewPi Control v0.0.1 Industrial — Sierra Dorada Automation Suite 4.0
# -----------------------------------------------------------------------------
# Este instalador configura Docker + Docker Compose, clona (o actualiza) el
# repositorio BrewPiControl y levanta todos los contenedores necesarios.
# Ejecutar como usuario con privilegios sudo. Ejemplo:
#   curl -fsSL https://raw.githubusercontent.com/raydan08x/BrewPiControl/main/scripts/install_brewpi_rpi.sh | bash
# -----------------------------------------------------------------------------

set -euo pipefail

REPO_URL="https://github.com/Raydan08x/BrewPiControl.git"
INSTALL_DIR="$HOME/BrewPiControl"

print_step() {
  echo -e "\n\e[1;32m==> $1\e[0m"
}

# 1. Actualización del sistema
print_step "Actualizando paquetes del sistema"
sudo apt update && sudo apt full-upgrade -y

# 2. Instalar dependencias básicas
print_step "Instalando dependencias básicas (curl, git)"
sudo apt install -y curl git ca-certificates lsb-release gnupg

# 3. Instalar Docker Engine (script oficial)
if ! command -v docker &>/dev/null; then
  print_step "Instalando Docker Engine"
  curl -fsSL https://get.docker.com | sudo sh
  # Añadir usuario al grupo docker para evitar usar sudo
  sudo usermod -aG docker "$USER"
else
  echo "Docker ya está instalado, omitiendo."
fi

# 4. Instalar Docker Compose v2 (plugin)
if ! docker compose version &>/dev/null; then
  print_step "Instalando Docker Compose plugin"
  sudo apt install -y docker-compose-plugin
else
  echo "Docker Compose plugin ya instalado, omitiendo."
fi

# 5. Habilitar e iniciar el servicio Docker
print_step "Habilitando servicio Docker"
sudo systemctl enable docker
sudo systemctl start docker

# 6. Clonar o actualizar el repositorio BrewPiControl
if [ -d "$INSTALL_DIR/.git" ]; then
  print_step "Actualizando repositorio BrewPiControl en $INSTALL_DIR"
  git -C "$INSTALL_DIR" pull
else
  print_step "Clonando BrewPiControl en $INSTALL_DIR"
  git clone "$REPO_URL" "$INSTALL_DIR"
fi

# 7. Construir y desplegar los contenedores
print_step "Construyendo y levantando contenedores Docker"
cd "$INSTALL_DIR"
docker compose up -d --build

print_step "Instalación completada"
echo "\nAPI disponible en   : http://$(hostname -I | awk '{print $1}'):8000/docs"
echo "HMI disponible en   : http://$(hostname -I | awk '{print $1}'):8080"
echo "\n(Reinicia tu sesión para que el grupo 'docker' surta efecto si es necesario)"
