# Solinal - Sistema de Gestión de Cumplimiento y Auditoría con IA

Proyecto monorepo con frontend (React) y backend (Node.js + Express) integrados.

## 📁 Estructura

```
Solinal_papas_fritas/
├── frontend/                 ← React + Vite + TypeScript
│   ├── src/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── README.md
│
├── backend/                  ← Node.js + Express + PostgreSQL
│   ├── src/
│   ├── package.json
│   ├── tsconfig.json
│   ├── drizzle.config.ts
│   ├── Dockerfile
│   └── README.md
│
├── docker-compose.yml        ← PostgreSQL + Redis
├── ARQUITECTURA.md           ← Documentación de diseño
└── package.json              ← Root monorepo
```

---

## 🚀 Quick Start

### 1. Instalar dependencias

```bash
npm install
```

Esto instala dependencias en `frontend/` y `backend/` automáticamente.

### 2. Levantar base de datos

```bash
npm run db:up
```

Levanta PostgreSQL y Redis en Docker.

### 3. Ejecutar ambos servidores

```bash
# Opción A: En paralelo (ambos en la misma terminal)
npm run dev

# Opción B: En terminales separadas
npm run frontend   # Terminal 1 → http://localhost:5173
npm run backend    # Terminal 2 → http://localhost:3001
```

---

## 📚 Documentación

- **[Frontend](./frontend/README.md)** - React, componentes, rutas
- **[Backend](./backend/README.md)** - API, base de datos, IA
- **[Arquitectura General](./ARQUITECTURA.md)** - Visión completa del proyecto

---

## 🛠 Scripts disponibles

```bash
npm run dev              # Ejecutar frontend + backend en paralelo
npm run frontend         # Solo frontend (http://localhost:5173)
npm run backend          # Solo backend (http://localhost:3001)
npm run build            # Compilar ambos
npm run db:up           # Levantar PostgreSQL + Redis
npm run db:down         # Detener containers
```

---

## 🔧 Configuración necesaria

### Backend

1. Copia el archivo de ejemplo:
```bash
cp backend/.env.example backend/.env
```

2. Edita `backend/.env` y agrega tu API key de Claude:
```env
ANTHROPIC_API_KEY=sk-ant-...
```

Obtén la key en: https://console.anthropic.com/

---

## 📊 Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite + TypeScript + Tailwind |
| Backend | Node.js + Express + TypeScript |
| DB | PostgreSQL 16 + Drizzle ORM |
| IA | Claude API (Anthropic) |
| Cache | Redis (opcional) |
| Hosting | Railway.app |

---

## 🆘 Troubleshooting

### "Cannot find module" en frontend o backend

```bash
cd frontend
npm install

cd ../backend
npm install
```

### PostgreSQL no se conecta

```bash
# Ver estado de los containers
docker ps

# Reiniciar
npm run db:down
npm run db:up

# Ver logs
docker-compose logs postgres
```

### Frontend/Backend no se comunican

Verifica que:
1. Backend esté corriendo en `http://localhost:3001`
2. CORS esté configurado en `backend/.env`
3. El frontend use la URL correcta para las requests

---

## 📝 Licencia

MIT
