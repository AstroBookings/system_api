import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SharedModule } from '../../shared/shared.module';
import { AdminModule } from '../admin/admin.module';
import { AdminController } from './admin/admin.controller';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './services/authentication.service';
import { HashService } from './services/hash.service';
import { TokenService } from './services/token.service';
import { UserEntity } from './services/user.entity';

const jwtConfig = {
  secret: 'secret',
  signOptions: { expiresIn: '1y' },
};

/**
 * Module for authentication-related functionality.
 */
@Module({
  imports: [MikroOrmModule.forFeature([UserEntity]), JwtModule.register(jwtConfig), SharedModule, AdminModule],
  controllers: [AuthenticationController, AdminController],
  providers: [AuthenticationService, HashService, TokenService],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
