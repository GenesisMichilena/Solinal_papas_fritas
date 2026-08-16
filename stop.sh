#!/bin/bash

# Script para detener todos los servicios de Solinal

echo "🛑 Deteniendo servicios de Solinal..."

# Detener procesos Node.js
echo "Deteniendo backend y frontend..."
pkill -f "npm run dev" || true

# Detener contenedores Docker
echo "Deteniendo contenedores Docker..."
docker-compose down

echo "✅ Todos los servicios han sido detenidos"
