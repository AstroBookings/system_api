import { AdminModule } from '@api/admin/admin.module';
import { JWT_CONFIG } from '@core/config/jwt.config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SharedModule } from '@shared/shared.module';
import { AuthenticationController } from './authentication.controller';
import { AuxController } from './aux/aux.controller';
import { AuthenticationService } from './services/authentication.service';
import { HashService } from './services/hash.service';
import { TokenService } from './services/token.service';
import { UserEntity } from './services/user.entity';

/**
 * Module for authentication-related functionality.
 */
@Module({
  imports: [MikroOrmModule.forFeature([UserEntity]), JwtModule.register(JWT_CONFIG), SharedModule, AdminModule],
  controllers: [AuthenticationController, AuxController],
  providers: [AuthenticationService, HashService, TokenService],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
