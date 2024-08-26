import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SharedModule } from '../../../shared/shared.module';
import { AuthenticationRepositoryModule } from '../repositories/authentication-repository.module';
import { AuthenticationService } from './authentication.service';
import { HashService } from './hash.service';
import { TokenService } from './token.service';

const jwtConfig = {
  secret: 'secret',
  signOptions: { expiresIn: '1y' },
};

/**
 * Module for authentication-related services.
 */
@Module({
  imports: [
    AuthenticationRepositoryModule,
    JwtModule.register(jwtConfig),
    SharedModule,
  ],
  providers: [AuthenticationService, HashService, TokenService],
  exports: [AuthenticationService],
})
export class AuthenticationServicesModule {}
