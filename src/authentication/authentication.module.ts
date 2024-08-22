import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { User } from './models/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule.register({
    secret: 'secret',
    signOptions: { expiresIn: '1y' },
  })],
  controllers: [AuthenticationController],
  providers: [AuthenticationService]
})
export class AuthenticationModule { }
