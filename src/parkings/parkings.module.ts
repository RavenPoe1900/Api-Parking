import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingsController } from './infrastructure/parkings.controller';
import { ParkingsService } from './application/parkings.service';
import { LogsModule } from 'src/logs/logs.module';
import { Parking } from './domain/parking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Parking]), LogsModule],
  controllers: [ParkingsController],
  providers: [ParkingsService],
  exports: [ParkingsService],
})
export class ParkingsModule {}
