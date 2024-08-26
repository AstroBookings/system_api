import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { UserEntity } from './user.entity';

/**
 * Module for authentication-related repositories.
 */
@Module({
  imports: [MikroOrmModule.forFeature([UserEntity])],
  exports: [MikroOrmModule],
})
export class AuthenticationRepositoryModule {}
