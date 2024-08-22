import { MongoDriver } from '@mikro-orm/mongodb';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { User } from './authentication/models/user.entity';
import { AuthenticationModule } from './authentication/authentication.module';

@Module({
  imports: [
    MikroOrmModule.forRoot({
      entities: [User],
      dbName: 'SystemDB',
      clientUrl: 'mongodb://localhost:27017',
      debug: true,
      driver: MongoDriver,
    }),
    AuthenticationModule,
  ],
})
export class AppModule {}