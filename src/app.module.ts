import { MONGO_CONFIG } from '@core/config/mikro-orm.mongo.config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AdminModule } from './api/admin/admin.module';
import { AuthenticationModule } from './api/authentication/authentication.module';
import { LoggerMiddleware } from './core/logger.middleware';

@Module({
  imports: [MikroOrmModule.forRoot(MONGO_CONFIG), AuthenticationModule, AdminModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
