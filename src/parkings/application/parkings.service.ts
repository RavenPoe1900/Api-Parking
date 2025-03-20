import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/_shared/applications/base.service';
import { Repository } from 'typeorm';
import { Parking } from '../domain/parking.entity';
import { LogsService } from 'src/logs/application/logs.service';

@Injectable()
export class ParkingsService extends BaseService<Parking> {
  constructor(
    @InjectRepository(Parking)
    private readonly parkingRepository: Repository<Parking>,
    protected readonly logsService: LogsService,
  ) {
    super(parkingRepository, logsService);
  }
}
