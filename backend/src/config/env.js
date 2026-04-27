const { z } = require('zod');
require('dotenv').config();

const envSchema = z.object({
  PORT: z.string().default('3001'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  YOUTUBE_API_KEY: z.string().min(1, 'YOUTUBE_API_KEY is required'),
  GEMINI_API_KEY: z.string().min(1, 'GEMINI_API_KEY is required'),
  AI_MODEL: z.string().default('gemini-3-flash-preview'),
  CACHE_TTL_SECONDS: z.string().transform(Number).default('86400'),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
});

const envServer = envSchema.safeParse(process.env);

if (!envServer.success) {
  console.error('❌ Invalid environment variables:', JSON.stringify(envServer.error.format(), null, 2));
  process.exit(1);
}

module.exports = envServer.data;
