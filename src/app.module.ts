import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule } from './authentication/authentication.module';
import { User } from './authentication/models/user.entity';


@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mongodb',
    url: 'mongodb://localhost:27017',
    database: 'SystemDB',
    entities: [User],
  }), AuthenticationModule],
})
export class AppModule {}