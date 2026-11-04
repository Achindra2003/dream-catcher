import express from 'express';
import helmet from 'helmet';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { getPool } from './config/database.js';
import dreamsRouter from './routes/dreams.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

// Security headers in production (CSP relaxed for Google Fonts and inline styles)
if (process.env.NODE_ENV === 'production') {
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        'font-src': ["'self'", 'https://fonts.gstatic.com']
      }
    }
  }));
}

app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

// Liveness probe: process is up (used by CI tests and Render health check)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: Math.round(process.uptime()) });
});

// Readiness probe: process can reach the database
app.get('/ready', async (req, res) => {
  try {
    await getPool().query('SELECT 1');
    res.json({ status: 'ready', database: 'up' });
  } catch (error) {
    res.status(503).json({ status: 'not_ready', database: 'down' });
  }
});

app.use('/api/dreams', dreamsRouter);

export default app;
