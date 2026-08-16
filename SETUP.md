# 🚀 Guía de Configuración de Solinal

## Requisitos Previos

- **Node.js** 18+ (verificar con `node --version`)
- **npm** 9+ (verificar con `npm --version`)
- **Docker** y **docker-compose** (para la BD y Redis)
- **API Key de Anthropic** (Claude API) - [Obtener aquí](https://console.anthropic.com)

## Instalación Rápida

### 1. Clonar el Repositorio
```bash
git clone <repository-url>
cd Solinal_papas_fritas
```

### 2. Instalar Dependencias
```bash
npm run install:all
```

Este comando instala las dependencias de backend y frontend automáticamente.

### 3. Configurar Variables de Entorno

#### Backend (.env)
```bash
# Ya debe existir en backend/.env
# Pero verifica que esté configurado correctamente:
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://solinal:solinal123@localhost:5432/solinal_db
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx  # ⚠️ Reemplaza con tu API key
JWT_SECRET=tu_secret_muy_seguro_aqui
JWT_EXPIRATION=7d
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

#### Frontend (.env.development)
```bash
# Ya debe existir en frontend/.env.development
VITE_API_URL=http://localhost:3001/api
```

### 4. Iniciar la Base de Datos

```bash
npm run db:up
```

Esto inicia PostgreSQL y Redis con Docker.

### 5. Compilar los Proyectos

```bash
# Backend
npm run build:backend

# Frontend
npm run build:frontend
```

### 6. Iniciar en Desarrollo

Abre **dos terminales** diferentes:

**Terminal 1 - Backend:**
```bash
npm run dev:backend
```
Verás: `Server running on port 3001`

**Terminal 2 - Frontend:**
```bash
npm run dev:frontend
```
Verás: `Local: http://localhost:5173/`

## Ejecución Rápida con Script

```bash
# Hacer el script ejecutable
chmod +x start.sh stop.sh

# Iniciar todo de una vez
./start.sh

# Detener todo
./stop.sh
```

## Verificar que Todo Funciona

### 1. Health Check del Backend
```bash
curl http://localhost:3001/health
# Respuesta esperada: {"status":"ok","timestamp":"2026-08-16T..."}
```

### 2. Acceder al Frontend
Abre tu navegador: `http://localhost:5173`

### 3. Probar la IA
- Ve a un documento en la interfaz
- Usa el "Asistente de IA" para:
  - **Analizar cumplimiento** contra estándares (ISO 27001, GDPR, etc.)
  - **Generar resúmenes** automáticos
  - **Identificar brechas** de cumplimiento

## Estructura de Carpetas

```
.
├── backend/
│   ├── src/
│   │   ├── server.ts          # Servidor Express
│   │   ├── services/
│   │   │   └── aiService.ts   # Lógica de IA con Claude
│   │   ├── routes/
│   │   │   ├── ai.ts          # Endpoints de IA
│   │   │   ├── auth.ts
│   │   │   ├── documents.ts
│   │   │   ├── compliance.ts
│   │   │   └── audit.ts
│   │   └── db/
│   │       ├── schema.ts      # Esquema Drizzle ORM
│   │       └── init.ts
│   ├── .env                   # Variables de entorno
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── AIAssistant.tsx     # Componente nuevo de IA
│   │   │   ├── layout/
│   │   │   └── ui/
│   │   ├── hooks/
│   │   │   └── useAI.ts            # Hooks para IA
│   │   ├── services/
│   │   │   └── apiService.ts       # Cliente API
│   │   └── routes/
│   ├── .env.development            # Config desarrollo
│   ├── .env.production             # Config producción
│   └── tsconfig.json
│
├── docker-compose.yml              # Servicios Docker
├── start.sh                        # Script de inicio
├── stop.sh                         # Script de parada
└── README.md
```

## API Endpoints Disponibles

### AI (Nuevo)
- `POST /api/ai/analyze` - Analizar documento contra estándar
- `POST /api/ai/summarize` - Generar resumen
- `POST /api/ai/identify-gaps` - Identificar brechas

### Documents
- `GET /api/documents` - Listar documentos
- `POST /api/documents` - Crear documento
- `PUT /api/documents/:id` - Actualizar
- `DELETE /api/documents/:id` - Eliminar

### Compliance
- `GET /api/compliance` - Estado de cumplimiento
- `GET /api/compliance/alerts` - Alertas
- `GET /api/compliance/requirements` - Requisitos

### Audit
- `GET /api/audit` - Listar registros
- `POST /api/audit` - Registrar acción

### Auth
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/verify` - Verificar token

## Solución de Problemas

### Error: "Cannot find module 'react-router-dom'"
```bash
# Reinstalar dependencias
npm install --prefix frontend
npm run build:frontend
```

### Error: "ANTHROPIC_API_KEY is not set"
```bash
# Verificar que backend/.env tenga la API key
cat backend/.env | grep ANTHROPIC_API_KEY

# Si no está, actualizar:
echo "ANTHROPIC_API_KEY=sk-ant-xxxxx" >> backend/.env
```

### PostgreSQL no inicia
```bash
# Ver logs de Docker
docker logs solinal_postgres

# Reiniciar servicios
npm run db:down
npm run db:up
```

### Puerto 3001 o 5173 en uso
```bash
# Cambiar en .env o vite.config.ts
# Backend: cambiar PORT en backend/.env
# Frontend: cambiar en frontend/vite.config.ts

# O matar el proceso:
# Linux/Mac:
lsof -i :3001 | grep LISTEN | awk '{print $2}' | xargs kill -9
lsof -i :5173 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Windows:
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

## Desarrollo

### Agregar Nueva Ruta API
1. Crear archivo en `backend/src/routes/`
2. Importar en `backend/src/server.ts`
3. Añadir con `app.use('/api/path', routeHandler)`

### Usar la IA en un Componente
```tsx
import { useAIAnalysis } from '@/hooks/useAI';

export function MyComponent() {
  const { analyze, loading, error, data } = useAIAnalysis();

  const handleAnalyze = async () => {
    const result = await analyze(documentContent, 'ISO 27001');
    // Usar result.score, result.risks, etc.
  };

  return (
    <button onClick={handleAnalyze} disabled={loading}>
      Analizar
    </button>
  );
}
```

### Agregar Nueva Función de IA
1. Implementar en `backend/src/services/aiService.ts`
2. Crear endpoint en `backend/src/routes/ai.ts`
3. Exportar función en `frontend/src/services/apiService.ts`
4. Crear hook en `frontend/src/hooks/useAI.ts`

## Producción

### Compilar para Producción
```bash
npm run build:backend
npm run build:frontend
```

### Variables de Entorno en Producción
- Actualizar `ANTHROPIC_API_KEY`
- Cambiar `DATABASE_URL` a base de datos remota
- Actualizar `CORS_ORIGIN` a dominio de producción
- Cambiar `JWT_SECRET` a un valor seguro

### Desplegar Backend
```bash
# Usar Node.js runtime (Render, Railway, Heroku, etc.)
node backend/dist/server.js
```

### Desplegar Frontend
```bash
# Copiar contenido de frontend/dist a hosting estático
# (Vercel, Netlify, GitHub Pages, S3, etc.)
```

## Soporte y Documentación

- 📚 [Documentación de Arquitectura](./ARQUITECTURA.md)
- 🔗 [API Drizzle ORM](https://orm.drizzle.team)
- 🤖 [Claude API Docs](https://docs.anthropic.com)
- ⚛️ [React Docs](https://react.dev)
- 🚀 [Express Docs](https://expressjs.com)

---

**Última actualización**: 2026-08-16
**Versión**: 1.0.0
