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
        return text.split(';').map(entry => entry.replace(/,[^]*$/, ''));
      }),
    PORT: z.coerce.number().default(3000),
    HOSTNAME: z.string().default('0.0.0.0'),
  },
  client: {},
  runtimeEnv: process.env,
  clientPrefix: '',
});
