# Etapa de construcción
FROM node:14-alpine AS builder

WORKDIR /app

# Instala las dependencias de la aplicación
COPY package*.json ./

RUN npm install

# Copia el resto de los archivos de la aplicación
COPY . .

# Compila la aplicación (si es necesario)
RUN npm run start

# Etapa de producción
FROM nginx:alpine

# Copia los archivos estáticos de la etapa de construcción
COPY --from=builder /app/public /usr/share/nginx/html

# Exponer el puerto 80 (puerto predeterminado de Nginx)
EXPOSE 80

# CMD predeterminado de la imagen de Nginx para iniciar el servidor
CMD ["nginx", "-g", "daemon off;"]
