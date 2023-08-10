import {
  HttpAdapterHost,
  NestFactory,
} from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { env } from './env';
import {
  Handlers,
  Integrations,
  init,
  getCurrentHub,
  autoDiscoverNodePerformanceMonitoringIntegrations,
  captureException,
} from '@sentry/node';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { PrismaService } from 'nestjs-prisma';
import { ProfilingIntegration } from '@sentry/profiling-node';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';

async function bootstrap() {
  const expressApp = express();

  if (env.SENTRY_DSN) {
    init({
      dsn: env.SENTRY_DSN,
      environment: env.SENTRY_ENVIRONMENT,
      integrations: [
        new Integrations.Http({ tracing: true }),
        new Integrations.Express({
          app: expressApp,
        }),
        new ProfilingIntegration(),
        new Integrations.LocalVariables({
          captureAllExceptions: true,
        }),
        ...autoDiscoverNodePerformanceMonitoringIntegrations(),
      ],
      tracesSampleRate: env.SENTRY_TRACES_SAMPLE_RATE,
      profilesSampleRate: env.SENTRY_PROFILES_SAMPLE_RATE,
      includeLocalVariables: true,
    });
    expressApp.use(Handlers.requestHandler());
    expressApp.use(Handlers.tracingHandler());
  }

  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
  app.use(bodyParser.json({ limit: '50mb' }));

  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new SentryExceptionFilter(httpAdapter));

  if (env.SENTRY_DSN) {
    expressApp.use(Handlers.errorHandler());
    getCurrentHub().getClient()!.addIntegration!(
      new Integrations.Prisma({ client: app.get(PrismaService) }),
    );
  }
  await app.listen(env.PORT, env.HOSTNAME);
}
bootstrap();

@Catch()
class SentryExceptionFilter implements ExceptionFilter {

  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
  ) { }

  catch(exception: HttpException, host: ArgumentsHost) {
    const eventId = exception instanceof NotFoundException
      ? null
      : (console.error(exception), captureException(exception));

    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    httpAdapter.reply(
      ctx.getResponse(),
      {
        statusCode: httpStatus,
        message: exception + '',
        eventId,
      },
      httpStatus,
    );
  }

}
