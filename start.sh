#!/bin/bash

# Script para iniciar el proyecto Solinal completo
# Este script inicia la BD, backend y frontend

set -e

echo "🚀 Iniciando Solinal - Sistema de Gestión de Cumplimiento y Auditoría"
echo "======================================================================"

# Paso 1: Iniciar servicios Docker
echo -e "\n📦 Iniciando servicios Docker (PostgreSQL y Redis)..."
docker-compose up -d

# Esperar a que PostgreSQL esté listo
echo "⏳ Esperando a que PostgreSQL esté listo..."
sleep 5

# Paso 2: Instalar dependencias si es necesario
if [ ! -d "backend/node_modules" ]; then
  echo -e "\n📥 Instalando dependencias del backend..."
  npm install --prefix backend
fi

if [ ! -d "frontend/node_modules" ]; then
  echo -e "\n📥 Instalando dependencias del frontend..."
  npm install --prefix frontend
fi

# Paso 3: Construir los proyectos
echo -e "\n🔨 Compilando backend..."
npm run build:backend

echo -e "\n🔨 Compilando frontend..."
npm run build:frontend

# Paso 4: Iniciar servicios en background
echo -e "\n🌐 Iniciando backend en puerto 3001..."
npm run dev:backend &
BACKEND_PID=$!

echo "⏳ Esperando a que el backend esté listo..."
sleep 3

echo -e "\n🎨 Iniciando frontend en puerto 5173..."
npm run dev:frontend &
FRONTEND_PID=$!

echo -e "\n======================================================================"
echo "✅ ¡Solinal está listo!"
echo "======================================================================"
echo ""
echo "📍 Acceso a la aplicación:"
echo "   - Frontend: http://localhost:5173"
echo "   - Backend API: http://localhost:3001/api"
echo "   - Health Check: http://localhost:3001/health"
echo ""
echo "🗄️  Base de datos:"
echo "   - PostgreSQL: localhost:5432"
echo "   - Usuario: solinal"
echo "   - Contraseña: solinal123"
echo "   - Base de datos: solinal_db"
echo ""
echo "🤖 Requisitos:"
echo "   - ANTHROPIC_API_KEY configurada en backend/.env"
echo "   - Docker y docker-compose instalados"
echo ""
echo "📊 Para ver logs:"
echo "   - Backend: npm run dev:backend"
echo "   - Frontend: npm run dev:frontend"
echo ""
echo "Presiona Ctrl+C para detener todos los servicios"
echo "======================================================================"

# Mantener los procesos en ejecución
wait
