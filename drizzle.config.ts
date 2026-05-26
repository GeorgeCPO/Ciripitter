import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

const { DATABASE_URL } = process.env;
if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');

export default defineConfig({
  schema: './src/db/schema',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: DATABASE_URL,
  },
});
