import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { SharedModule } from '../../shared/shared.module';
import { AdminController } from './admin/admin.controller';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { UserEntity } from './models/user.entity';

@Module({
  imports: [MikroOrmModule.forFeature([UserEntity]), SharedModule],
  controllers: [AuthenticationController, AdminController],
  providers: [AuthenticationService],
})
export class AuthenticationModule {}
