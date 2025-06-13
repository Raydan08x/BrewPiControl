# Dockerfile del Frontend HMI (SCADA)
# -----------------------------------
# Utilizamos Nginx como servidor web ligero para servir la aplicación HMI.
# Si en el futuro migramos a un framework JS (React/Vue), podremos construirlo
# previamente y copiar la carpeta de build. Por ahora, servimos archivos estáticos.

FROM nginx:1.27-alpine

# Copiamos la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiamos los archivos estáticos del HMI al directorio html de Nginx
COPY ./static /usr/share/nginx/html

# Exponemos el puerto 80 (HTTP)
EXPOSE 80

# Nginx se inicia automáticamente usando el ENTRYPOINT de la imagen base
