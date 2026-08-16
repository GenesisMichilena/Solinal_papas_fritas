import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './db/init.js';
import authRoutes from './routes/auth.js';
import documentsRoutes from './routes/documents.js';
import complianceRoutes from './routes/compliance.js';
import auditRoutes from './routes/audit.js';
import aiRoutes from './routes/ai.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/compliance', complianceRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Inicializar base de datos y servidor
async function start() {
  try {
    await initializeDatabase();
    console.log('✓ Base de datos inicializada');

    app.listen(PORT, () => {
      console.log(`✓ Servidor Express corriendo en puerto ${PORT}`);
      console.log(`✓ API en http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('✗ Error al iniciar servidor:', error);
    process.exit(1);
  }
}

start();

export default app;
