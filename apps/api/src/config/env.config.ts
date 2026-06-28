import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  PORT: z.coerce.number().default(3001),
  BASE_URL: z.string().url(),
  FRONTEND_URL: z.string().url(),
  DATABASE_URL: z.string().min(1),
  DATABASE_POOL_MIN: z.coerce.number().default(2),
  DATABASE_POOL_MAX: z.coerce.number().default(10),
  REDIS_URL: z.string().min(1),
  REDIS_TTL_RESERVA: z.coerce.number().default(600),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  MP_ACCESS_TOKEN: z.string().min(1),
  MP_PUBLIC_KEY: z.string().min(1),
  MP_WEBHOOK_SECRET: z.string().min(1),
  ENCRYPTION_KEY: z.string().min(32),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().optional(),
    SENTRY_DSN: z.string().optional(),
}).superRefine((env, ctx) => {
  if (env.NODE_ENV !== 'production') return;

  if (env.MP_ACCESS_TOKEN.startsWith('TEST-')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['MP_ACCESS_TOKEN'],
      message: 'En produccion MP_ACCESS_TOKEN no puede ser una clave TEST',
    });
  }

  if (env.MP_PUBLIC_KEY.startsWith('TEST-')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['MP_PUBLIC_KEY'],
      message: 'En produccion MP_PUBLIC_KEY no puede ser una clave TEST',
    });
  }

  if (env.MP_WEBHOOK_SECRET === 'dev-secret') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['MP_WEBHOOK_SECRET'],
      message: 'En produccion MP_WEBHOOK_SECRET no puede ser dev-secret',
    });
  }

  if (env.BASE_URL.includes('localhost')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['BASE_URL'],
      message: 'En produccion BASE_URL no puede apuntar a localhost',
    });
  }

  if (env.FRONTEND_URL.includes('localhost')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['FRONTEND_URL'],
      message: 'En produccion FRONTEND_URL no puede apuntar a localhost',
    });
  }
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): Env {
  const result = envSchema.safeParse(config);
  if (!result.success) {
    const errors = result.error.errors
      .map((e) => `  x ${e.path.join('.')}: ${e.message}`)
      .join('\n');
    throw new Error(
      `\nVariables de entorno invalidas:\n${errors}\n\nCopia .env.example a .env y completa los valores.\n`,
    );
  }
  return result.data;
}
