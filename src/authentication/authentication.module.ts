import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { User } from './models/user.entity';

const jwtConfig = {
  secret: 'secret',
  signOptions: { expiresIn: '1y' },
};

@Module({
  imports: [
    MikroOrmModule.forFeature([User]),
    JwtModule.register(jwtConfig)],
  controllers: [AuthenticationController],
  providers: [AuthenticationService]
})
export class AuthenticationModule { }
