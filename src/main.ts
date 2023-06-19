import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { env } from './env';
import {
  Handlers,
  Integrations,
  init,
  getCurrentHub,
  autoDiscoverNodePerformanceMonitoringIntegrations,
} from '@sentry/node';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { PrismaService } from 'nestjs-prisma';
import { ProfilingIntegration } from '@sentry/profiling-node';

async function bootstrap() {
  const expressApp = express();

  if (env.SENTRY_DSN) {
    init({
      dsn: env.SENTRY_DSN,
      integrations: [
        new Integrations.Http({ tracing: true }),
        new Integrations.Express({
          app: expressApp,
        }),
        new ProfilingIntegration(),
        ...autoDiscoverNodePerformanceMonitoringIntegrations(),
      ],
      tracesSampleRate: env.SENTRY_TRACES_SAMPLE_RATE,
      profilesSampleRate: env.SENTRY_PROFILES_SAMPLE_RATE,
    });
    expressApp.use(Handlers.requestHandler());
    expressApp.use(Handlers.tracingHandler());
  }

  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
  app.use(bodyParser.json({ limit: '50mb' }));

  if (env.SENTRY_DSN) {
    expressApp.use(Handlers.errorHandler());
    getCurrentHub().getClient()!.addIntegration!(
      new Integrations.Prisma({ client: app.get(PrismaService) }),
    );
  }
  await app.listen(env.PORT, env.HOSTNAME);
}
bootstrap();
