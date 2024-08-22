import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';


import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from './models/user.entity';


@Module({
  imports: [
    MikroOrmModule.forFeature([User]),
    JwtModule.register({
    secret: 'secret',
    signOptions: { expiresIn: '1y' },
  })],
  controllers: [AuthenticationController],
  providers: [AuthenticationService]
})
export class AuthenticationModule { }
