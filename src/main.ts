import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BackendBackendValidationPipe } from './common/shared/pipes/backendValidation.pipe';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV === 'dev') {
    app.enableCors({ origin: process.env.FRONTEND_URI });
  } else {
    app.enableCors({ origin: process.env.FRONTEND_URI });
    logger.log(`Accepting requests from origin "${process.env.FRONTEND_URI}"`);
  }

  app.useGlobalPipes(new BackendBackendValidationPipe());
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT || 3002);
  logger.log(`Application listening on port ${process.env.PORT}`);
}
bootstrap();
