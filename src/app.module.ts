import { MongoDriver } from '@mikro-orm/mongodb';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthenticationModule } from './authentication/authentication.module';
import { User } from './authentication/models/user.entity';
import { LoggerMiddleware } from './core/logger.middleware';

const mikroOrmConfig = {
  driver: MongoDriver,
  clientUrl: 'mongodb://localhost:27017',
  dbName: 'SystemDB',
  entities: [User],
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
