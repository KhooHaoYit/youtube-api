import {
  HttpAdapterHost,
  NestFactory,
} from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { env } from './env';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
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

  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
  app.use(bodyParser.json({ limit: '50mb' }));

  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new SentryExceptionFilter(httpAdapter));

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
      : (console.error(exception), null);

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
