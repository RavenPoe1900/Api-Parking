import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogsModule } from 'src/logs/logs.module';
import { VehicleDetail } from './domain/vehicleDetail.entity';
import { VehicleDetailsService } from './application/vehicleDetails.service';
import { VehicleDetailsController } from './infrastructure/vehicleDetails.controller';

@Module({
  imports: [TypeOrmModule.forFeature([VehicleDetail]), LogsModule],
  controllers: [VehicleDetailsController],
  providers: [VehicleDetailsService],
  exports: [VehicleDetailsService],
})
export class VehicleDetailsModule {}
