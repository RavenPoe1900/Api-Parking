import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/_shared/applications/base.service';
import { Repository } from 'typeorm';
import { Role } from '../domain/role.entity';
import { LogsService } from 'src/logs/application/logs.service';

@Injectable()
export class RolesService extends BaseService<Role> implements OnModuleInit {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    protected readonly logsService: LogsService,
  ) {
    super(roleRepository, logsService);
  }
  async onModuleInit() {
    await this.createIfNotExists({ name: 'employer' }, { name: 'employer' });
    await this.createIfNotExists({ name: 'admin' }, { name: 'admin' });
    await this.createIfNotExists({ name: 'client' }, { name: 'client' });
  }
}
