import 'dotenv/config';
import app from './app.js';
import { initDatabase } from './config/database-init.js';

console.log('Gemini key loaded:', !!process.env.GEMINI_API_KEY);
console.log('Gemini model:', process.env.GEMINI_MODEL);
console.log('Database configured:', !!process.env.DATABASE_URL);

const PORT = process.env.PORT || 3001;

initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(error => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });
