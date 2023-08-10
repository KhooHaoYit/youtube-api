import { createEnv } from "@t3-oss/env-core";
import { z } from 'zod';

export const env = createEnv({
  server: {
    DATABASE_URL: z.string(),
    PRIMARY_API_KEY: z.string().optional(),
    SECONDARY_API_KEY: z.string().regex(/^[^,\n]+,[^,\n]+(?:\n[^,\n]+,[^,\n]+)*$/).optional()
      .transform(text => {
        if (!text)
          return;
        return text.split('\n').map(entry => entry.replace(/,[^]*$/, ''));
      }),
    PORT: z.coerce.number().default(3000),
    HOSTNAME: z.string().default('0.0.0.0'),
    // Sentry
    SENTRY_DSN: z.string().optional(),
    SENTRY_ENVIRONMENT: z.enum(['local', 'production']).default('local'),
    SENTRY_TRACES_SAMPLE_RATE: z.coerce.number().min(0).max(1).default(1),
    SENTRY_PROFILES_SAMPLE_RATE: z.coerce.number().min(0).max(1).default(1),
    // Development only
    YOUTUBE_COOKIE: z.string().optional(),
  },
  client: {},
  runtimeEnv: process.env,
  clientPrefix: '',
});
