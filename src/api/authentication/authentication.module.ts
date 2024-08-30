import { Module } from '@nestjs/common';
import { AdminModule } from '../admin/admin.module';
import { AdminController } from './admin/admin.controller';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationServicesModule } from './services/authentication-services.module';

/**
 * Module for authentication-related functionality.
 */
@Module({
  imports: [AuthenticationServicesModule, AdminModule],
  controllers: [AuthenticationController, AdminController],
})
export class AuthenticationModule {}
