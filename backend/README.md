# Solinal Backend

Backend para el sistema de gestión de cumplimiento y auditoría con IA.

## 🏗 Stack Tecnológico

- **Runtime**: Node.js + Express.js
- **Base de datos**: PostgreSQL 16
- **ORM**: Drizzle ORM
- **IA**: Claude API (Anthropic)
- **Autenticación**: JWT
- **Validación**: Zod

## 📋 Requisitos

- Node.js 18+
- PostgreSQL 14+
- Docker y Docker Compose (opcional)
- API Key de Anthropic Claude

## 🚀 Instalación

### 1. Clonar y configurar

```bash
cd backend
npm install
cp .env.example .env
```

### 2. Levantar PostgreSQL

#### Opción A: Con Docker (recomendado)

```bash
docker-compose up -d postgres
```

#### Opción B: PostgreSQL local

```bash
# Crear base de datos
createdb solinal_db

# Usuario: solinal
# Contraseña: solinal123
```

### 3. Configurar variables de entorno

Edita `.env`:

```env
DATABASE_URL=postgresql://solinal:solinal123@localhost:5432/solinal_db
ANTHROPIC_API_KEY=sk-ant-... # Tu API key
JWT_SECRET=tu_secret_muy_seguro
```

### 4. Iniciar servidor

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3001`

## 📚 Endpoints principales

### Auth
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión

### Documentos
- `GET /api/documents` - Listar documentos
- `POST /api/documents` - Crear documento
- `GET /api/documents/:id` - Obtener documento
- `PUT /api/documents/:id` - Actualizar documento
- `DELETE /api/documents/:id` - Eliminar documento

### Cumplimiento
- `GET /api/compliance` - Listar requisitos
- `POST /api/compliance/analyze` - Analizar con IA
- `GET /api/compliance/alerts` - Ver alertas

### Auditoría
- `GET /api/audit/logs` - Ver logs
- `POST /api/audit/export` - Exportar logs
- `GET /api/audit/report` - Generar reporte

### IA
- `POST /api/ai/analyze` - Analizar cumplimiento
- `POST /api/ai/summarize` - Generar resumen
- `POST /api/ai/identify-gaps` - Identificar gaps

## 🗄 Estructura de bases de datos

```
users
├── id (UUID)
├── email
├── password (hash)
├── firstName, lastName
├── role (admin, auditor, user)
└── timestamps

documents
├── id (UUID)
├── title, description, content
├── type (policy, procedure, evidence)
├── status (draft, approved, archived)
├── authorId (FK → users)
├── version
└── timestamps

compliance_requirements
├── id (UUID)
├── code (ISO-27001-A.5.1.1)
├── title, description
├── standard (ISO-27001, GDPR)
├── status, score
└── timestamps

audit_logs
├── id (UUID)
├── action, entity, entityId
├── userId (FK → users)
├── changes (JSONB)
├── ipAddress, userAgent
└── createdAt

compliance_alerts
├── id (UUID)
├── requirementId (FK)
├── severity (high, medium, low)
├── message, resolved
└── timestamps
```

## 🤖 Integración con Claude API

El backend usa Claude API para:

1. **Analizar documentos** de cumplimiento contra estándares (ISO, GDPR, etc.)
2. **Generar resúmenes** ejecutivos automáticos
3. **Identificar gaps** en requisitos de cumplimiento
4. **Detectar riesgos** en políticas y procedimientos

### Ejemplo de uso

```bash
curl -X POST http://localhost:3001/api/ai/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "content": "...",
    "standard": "ISO-27001"
  }'
```

## 📊 Desarrollo

### Scripts disponibles

```bash
npm run dev       # Desarrollo con hot-reload
npm run build     # Compilar TypeScript
npm start         # Ejecutar compilado
npm run db:seed   # Llenar base de datos
```

### Agregar nuevas rutas

1. Crear archivo en `src/routes/`
2. Importar en `src/server.ts`
3. Registrar: `app.use('/api/endpoint', routeName)`

## 🔐 Seguridad

- [ ] Implementar autenticación JWT
- [ ] Hash de contraseñas con bcrypt
- [ ] Rate limiting
- [ ] CORS configurado
- [ ] Validación de entrada con Zod
- [ ] Logging de auditoría

## 🚢 Despliegue

### Railway.app (recomendado)

1. Push a GitHub
2. Conecta repo en railway.app
3. Configura variables de entorno
4. Deploy automático

### Heroku

```bash
heroku login
heroku create solinal-backend
git push heroku main
```

### Docker

```bash
docker build -t solinal-backend .
docker run -p 3001:3001 solinal-backend
```

## 📝 Licencia

MIT

## 👥 Contacto

Para preguntas o sugerencias, contacta al equipo de desarrollo.
