# SOLINAL - Sistema de Gestión de Cumplimiento y Auditoría con IA

## 📋 Descripción

Solinal es una plataforma integral para la gestión de cumplimiento normativo y auditoría, potenciada por IA (Claude API). Permite a las organizaciones:

- ✅ Gestionar documentos de cumplimiento
- ✅ Analizar requisitos con IA
- ✅ Detectar gaps automáticamente
- ✅ Mantener logs de auditoría
- ✅ Generar reportes de compliance

---

## 🏗 Arquitectura General

```
Solinal/
├── Frontend (React + Vite)
│   ├── src/
│   │   ├── components/    (UI con Radix)
│   │   ├── routes/        (8 módulos principales)
│   │   ├── features/      (lógica de negocio)
│   │   └── context/       (estado global)
│   └── package.json
│
├── Backend (Node.js + Express)
│   ├── src/
│   │   ├── db/            (Schema PostgreSQL + init)
│   │   ├── routes/        (Auth, Documents, Compliance, Audit, AI)
│   │   ├── services/      (Claude AI integration)
│   │   └── server.ts      (Express app)
│   └── package.json
│
└── docker-compose.yml     (PostgreSQL + Redis)
```

---

## 🚀 Quick Start

### 1. Clonar el proyecto

```bash
git clone <repo>
cd Solinal_papas_fritas
```

### 2. Levantar infraestructura (PostgreSQL + Redis)

```bash
docker-compose up -d
```

### 3. Frontend

```bash
npm install
npm run dev
# Abre http://localhost:5173
```

### 4. Backend

```bash
cd backend
npm install
cp .env.example .env
# Edita .env con tu ANTHROPIC_API_KEY
npm run dev
# Servidor en http://localhost:3001
```

---

## 📚 Stack Recomendado (CONFIRMADO)

| Capa | Tecnología | Por qué |
|------|-----------|---------|
| **Frontend** | React 18 + Vite | Rápido, moderno, UI components Radix |
| **Backend** | Node.js + Express | Mismo lenguaje, fácil de escalar |
| **Base de datos** | PostgreSQL 16 | Enterprise, auditoría integrada |
| **ORM** | Drizzle ORM | Type-safe, ideal para TypeScript |
| **IA** | Claude (Anthropic) | Mejor para análisis legal/compliance |
| **Hosting** | Railway.app | Fácil, económico, CI/CD integrado |

---

## 📍 Estructura del Backend

### Routes principales

```
POST   /api/auth/register       - Registrar usuario
POST   /api/auth/login          - Login
GET    /api/documents           - Listar documentos
POST   /api/documents           - Crear documento
POST   /api/compliance/analyze  - Analizar con IA
GET    /api/audit/logs          - Ver auditoría
POST   /api/ai/analyze          - Análisis de cumplimiento
POST   /api/ai/summarize        - Generar resumen
POST   /api/ai/identify-gaps    - Identificar gaps
```

### Base de datos

Tablas principales:
- `users` - Usuarios del sistema
- `documents` - Documentos de cumplimiento
- `compliance_requirements` - Requisitos (ISO-27001, GDPR, etc.)
- `audit_logs` - Log de cambios (inmutable)
- `compliance_alerts` - Alertas automáticas

---

## 🤖 Integración Claude API

El backend ya está configurado para:

1. **Análisis de cumplimiento**: Evalúa documentos contra estándares
2. **Resúmenes**: Genera resúmenes ejecutivos automáticos
3. **Detección de gaps**: Identifica requisitos incumplidos

Ejemplo:

```bash
curl -X POST http://localhost:3001/api/ai/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Política de seguridad...",
    "standard": "ISO-27001"
  }'
```

---

## 🔧 Configuración requerida

### Variables de entorno (Backend)

Copia `backend/.env.example` a `backend/.env`:

```env
PORT=3001
DATABASE_URL=postgresql://solinal:solinal123@localhost:5432/solinal_db
ANTHROPIC_API_KEY=sk-ant-...  # ← OBTENER DE https://console.anthropic.com
JWT_SECRET=tu_secret_seguro
CORS_ORIGIN=http://localhost:5173
```

### Obtener API Key de Claude

1. Ve a https://console.anthropic.com/
2. Crea cuenta / inicia sesión
3. Genera API Key
4. Pégala en `.env`

---

## 📊 Próximos pasos

- [ ] Implementar autenticación JWT
- [ ] Integrar búsqueda full-text
- [ ] Agregar webhooks para alertas
- [ ] Crear dashboard de reportes
- [ ] Implementar versionado de documentos
- [ ] Desplegar en Railway.app

---

## 📖 Documentación detallada

- [Frontend README](./README.md)
- [Backend README](./backend/README.md)

---

## 🆘 Troubleshooting

### "Cannot connect to database"

```bash
# Verificar si PostgreSQL está corriendo
docker ps | grep postgres

# Reiniciar
docker-compose down
docker-compose up -d
```

### "ANTHROPIC_API_KEY not found"

```bash
# Asegúrate de que .env está en backend/
cat backend/.env | grep ANTHROPIC_API_KEY

# Si está vacío, obtén la key de https://console.anthropic.com/
```

### Frontend no se conecta al backend

```bash
# Verifica que backend esté corriendo
curl http://localhost:3001/health

# Si falla, revisa CORS en backend/.env
# Debe incluir http://localhost:5173
```

---

## 📝 Licencia

MIT

## 👥 Equipo

Solinal - Sistema de Compliance & Auditoría | 2024-2025
