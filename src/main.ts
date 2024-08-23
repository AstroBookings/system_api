import { LogLevel, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './core/all-exception.filter';

const nodeEnv = process.env.NODE_ENV;
const loggerLevel: LogLevel[] =
  nodeEnv === 'production'
    ? ['error', 'warn', 'log']
    : ['error', 'warn', 'log', 'debug', 'verbose'];
const validationPipeOptions = {
  forbidNonWhitelisted: true,
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: loggerLevel });
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe(validationPipeOptions));
  app.useGlobalFilters(new AllExceptionFilter());
  await app.listen(3000);
}
bootstrap();
