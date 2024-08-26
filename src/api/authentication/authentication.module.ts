import { Module } from '@nestjs/common';
import { AdminController } from './admin/admin.controller';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationServicesModule } from './services/authentication-services.module';

/**
 * Module for authentication-related functionality.
 */
@Module({
  imports: [AuthenticationServicesModule],
  controllers: [AuthenticationController, AdminController],
  exports: [],
})
export class AuthenticationModule {}
