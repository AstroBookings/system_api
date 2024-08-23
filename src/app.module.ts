import { MongoDriver } from '@mikro-orm/mongodb';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AuthenticationModule } from './authentication/authentication.module';
import { User } from './authentication/models/user.entity';

const mikroOrmConfig = {
  driver: MongoDriver,
  clientUrl: 'mongodb://localhost:27017',
  dbName: 'SystemDB',
  entities: [User],
  debug: true,
};

@Module({
  imports: [MikroOrmModule.forRoot(mikroOrmConfig), AuthenticationModule],
})
export class AppModule {}
