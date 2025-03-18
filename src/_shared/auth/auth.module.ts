import { Module } from '@nestjs/common';
import { AuthService } from './application/auth.service';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './insfractuture/auth.controller';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [UsersModule, RolesModule],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
