FROM node:22-alpine

WORKDIR /app

# Copiar package.json
COPY backend/package*.json ./

# Instalar dependencias
RUN npm install

# Copiar código fuente
COPY backend/src ./src
COPY backend/tsconfig.json ./

# Compilar TypeScript
RUN npm run build

# Exponer puerto
EXPOSE 3001

# Comando para iniciar
CMD ["npm", "start"]
