import { config } from 'dotenv';
import { z } from 'zod';

// Carregar variáveis de ambiente
config();

const envSchema = z.object({
  DATABASE_URL: z.string().url('Invalid DATABASE_URL format'),
  PORT: z.coerce.number().min(1000).max(65535).default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
});

export type Env = z.infer<typeof envSchema>;

export const env = envSchema.parse(process.env);