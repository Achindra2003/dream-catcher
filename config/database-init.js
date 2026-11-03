import { getPool } from './database.js';

// Create dreams table if it doesn't exist
export async function initDatabase() {
  try {
    await getPool().query(`
      CREATE TABLE IF NOT EXISTS dreams (
        id SERIAL PRIMARY KEY,
        dream_text TEXT NOT NULL,
        interpretation TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}
