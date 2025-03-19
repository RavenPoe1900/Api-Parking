import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/roles/domain/role.entity';
import { User } from './domain/user.entity';
import { UsersController } from './infrastructure/users.controller';
import { UsersService } from './application/users.service';
import { LogsModule } from 'src/logs/logs.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role]), LogsModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
