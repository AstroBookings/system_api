import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { HashService } from '../shared/hash-service';
import { SharedModule } from '../shared/shared.module';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { User } from './models/user.entity';

@Module({
  imports: [MikroOrmModule.forFeature([User]), SharedModule],
  controllers: [AuthenticationController],
  providers: [HashService, AuthenticationService],
})
export class AuthenticationModule {}
