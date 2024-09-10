import { AllExceptionsFilter } from '@core/all-exceptions.filter';
import { CustomLogger } from '@core/custom-logger.service';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const validationPipeOptions = {
  forbidNonWhitelisted: true,
};
const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: new CustomLogger() });
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe(validationPipeOptions));
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(PORT);
  new Logger('System API').verbose(`🚀  initialized on port ${PORT}`);
}
bootstrap();
