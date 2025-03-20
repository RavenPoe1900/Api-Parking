import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/_shared/applications/base.service';
import { Repository } from 'typeorm';
import { VehicleDetail } from '../domain/vehicleDetail.entity';
import { LogsService } from 'src/logs/application/logs.service';

@Injectable()
export class VehicleDetailsService extends BaseService<VehicleDetail> {
  constructor(
    @InjectRepository(VehicleDetail)
    private readonly vehicleDetailRepository: Repository<VehicleDetail>,
    protected readonly logsService: LogsService,
  ) {
    super(vehicleDetailRepository, logsService);
  }
}
