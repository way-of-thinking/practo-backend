import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BackendBackendValidationPipe } from './common/shared/pipes/backendValidation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new BackendBackendValidationPipe());
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT || 3002);
}
bootstrap();
