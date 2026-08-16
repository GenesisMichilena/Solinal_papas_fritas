import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://solinal:solinal123@localhost:5432/solinal_db',
});

export const db = drizzle(pool);

export async function initializeDatabase() {
  try {
    const connection = await pool.connect();
    console.log('✓ Conectado a PostgreSQL');
    connection.release();
  } catch (error) {
    console.error('✗ Error conectando a PostgreSQL:', error);
    throw error;
  }
}

export default pool;
