import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/_shared/applications/base.service';
import { Repository } from 'typeorm';
import { User } from '../domain/user.entity';
import { LogsService } from 'src/logs/application/logs.service';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    protected readonly logsService: LogsService,
  ) {
    super(userRepository, logsService);
  }
}
