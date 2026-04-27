const { z } = require('zod');
require('dotenv').config();

const envSchema = z.object({
  PORT: z.string().default('3001'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  YOUTUBE_API_KEY: z.string().min(1, 'YOUTUBE_API_KEY is required').optional(),
  OLLAMA_URL: z.string().url().default('http://localhost:11434'),
  AI_MODEL: z.string().default('llama3.2:3b'),
  CACHE_TTL_SECONDS: z.string().transform(Number).default('86400'),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
});

const envServer = envSchema.safeParse(process.env);

if (!envServer.success && process.env.NODE_ENV !== 'test') {
  console.error('❌ Invalid environment variables:', JSON.stringify(envServer.error.format(), null, 2));
  process.exit(1);
}

module.exports = envServer.data || {
  PORT: '3001',
  NODE_ENV: 'test',
  AI_MODEL: 'llama3.2:3b',
  CACHE_TTL_SECONDS: 86400,
  FRONTEND_URL: 'http://localhost:5173'
};
