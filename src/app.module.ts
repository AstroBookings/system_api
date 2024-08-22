import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthenticationModule } from './authentication/authentication.module';


@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/SystemDB'),
     AuthenticationModule
    ],
})
export class AppModule {}