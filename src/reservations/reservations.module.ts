import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationsController } from './infrastructure/reservations.controller';
import { ReservationsService } from './application/reservations.service';
import { LogsModule } from 'src/logs/logs.module';
import { Reservation } from './domain/reservation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation]), LogsModule],
  controllers: [ReservationsController],
  providers: [ReservationsService],
  exports: [ReservationsService],
})
export class ReservationsModule {}
