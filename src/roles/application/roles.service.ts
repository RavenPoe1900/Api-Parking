import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/_shared/applications/base.service';
import { Repository } from 'typeorm';
import { Role } from '../domain/role.entity';

@Injectable()
export class RolesService extends BaseService<Role> {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {
    super(roleRepository);
  }
}
