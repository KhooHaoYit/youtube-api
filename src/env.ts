import { createEnv } from "@t3-oss/env-core";
import { z } from 'zod';

export const env = createEnv({
  server: {
    DATABASE_URL: z.string(),
    PORT: z.coerce.number().default(3000),
    HOSTNAME: z.string().default('0.0.0.0'),
  },
  client: {},
  runtimeEnv: process.env,
  clientPrefix: '',
});
