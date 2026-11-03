import 'dotenv/config';
import app from './app.js';
import { initDatabase } from './config/database-init.js';

console.log('Groq key loaded:', !!process.env.GROQ_API_KEY);
console.log('Groq model:', process.env.GROQ_MODEL);
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
