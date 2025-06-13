# Dockerfile del Frontend HMI (SCADA)
# -----------------------------------
# Utilizamos Nginx como servidor web ligero para servir la aplicación HMI.
# Si en el futuro migramos a un framework JS (React/Vue), podremos construirlo
# previamente y copiar la carpeta de build. Por ahora, servimos archivos estáticos.

# Stage 1 – build React/Vite HMI -------------------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app

# Copiar los archivos de la SPA React (si existen)
COPY ./webapp/package*.json ./
RUN if [ -f package.json ]; then npm ci; fi

COPY ./webapp .

# Construir la aplicación sólo si hay package.json
RUN if [ -f package.json ]; then npm run build; fi

# Stage 2 – Nginx para servir los archivos estáticos -----------------------------
FROM nginx:1.27-alpine

# Copiar configuración personalizada
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar build de la SPA (cuando exista) y luego archivos estáticos como fallback
COPY ./static /usr/share/nginx/html
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponemos el puerto 80 (HTTP)
EXPOSE 80

# Nginx se inicia automáticamente usando el ENTRYPOINT de la imagen base
