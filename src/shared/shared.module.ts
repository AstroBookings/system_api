import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { HashService } from './hash-service';
import { IdService } from './id-service';
import { TokenService } from './token-service';
const jwtConfig = {
  secret: 'secret',
  signOptions: { expiresIn: '1y' },
};
@Module({
  imports: [JwtModule.register(jwtConfig)],
  providers: [HashService, IdService, JwtService, TokenService],
  exports: [HashService, IdService, TokenService],
})
export class SharedModule {}
