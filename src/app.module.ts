import { MongoDriver } from '@mikro-orm/mongodb';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthenticationModule } from './api/authentication/authentication.module';
import { UserEntity } from './api/authentication/services/user.entity';
import { LoggerMiddleware } from './middleware/logger.middleware';

// Configuration for MongoDB Database
const mikroOrmConfig = {
  driver: MongoDriver,
  clientUrl: 'mongodb://localhost:27017',
  dbName: 'SystemDB',
  entities: [UserEntity],
  debug: false,
};

@Module({
  imports: [MikroOrmModule.forRoot(mikroOrmConfig), AuthenticationModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
