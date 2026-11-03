import pg from 'pg';

const { Pool } = pg;

let pool = null;

function buildConfig() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set. Point it at a Postgres instance (see .env.example).');
  }
  // Render's managed Postgres requires TLS; local Postgres (docker-compose) does not.
  const isLocal = /@(localhost|127\.0\.0\.1|db)(:|\/)/.test(connectionString);
  return {
    connectionString,
    ssl: isLocal ? false : { rejectUnauthorized: false },
    max: 5
  };
}

export function getPool() {
  if (!pool) {
    pool = new Pool(buildConfig());
  }
  return pool;
}

export async function closeDatabase() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

export default { getPool, closeDatabase };
