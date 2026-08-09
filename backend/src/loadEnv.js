import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../.env');
const result = dotenv.config({ path: envPath });

console.log(`[loadEnv] Loading environment from: ${envPath}`);

if (result.error) {
  console.error('[loadEnv] Error loading .env file:', result.error);
} else {
  console.log('[loadEnv] .env file loaded successfully.');
}

if (!process.env.JWT_SECRET) {
  console.error('[loadEnv] WARNING: JWT_SECRET is not defined in process.env!');
} else {
  console.log('[loadEnv] JWT_SECRET is loaded.');
}

