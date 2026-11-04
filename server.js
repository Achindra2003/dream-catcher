import 'dotenv/config';
import app from './app.js';
import { initDatabase } from './config/database-init.js';
import { closeDatabase } from './config/database.js';

console.log('Groq key loaded:', !!process.env.GROQ_API_KEY);
console.log('Groq model:', process.env.GROQ_MODEL);
console.log('Database configured:', !!process.env.DATABASE_URL);

const PORT = process.env.PORT || 3001;

let server;
let isShuttingDown = false;

try {
  await initDatabase();
  server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
} catch (error) {
  console.error('Failed to initialize database:', error);
  process.exit(1);
}

// Stop accepting requests, then close the DB pool (Render sends SIGTERM on deploy)
function gracefulShutdown(signal) {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log(`${signal} received, shutting down gracefully`);

  server.close(async (error) => {
    if (error) {
      console.error('Error closing HTTP server:', error);
      process.exitCode = 1;
    } else {
      console.log('HTTP server closed');
    }
    try {
      await closeDatabase();
      console.log('Database pool closed');
    } catch (dbError) {
      console.error('Error closing database pool:', dbError);
      process.exitCode = 1;
    }
    process.exit();
  });
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
