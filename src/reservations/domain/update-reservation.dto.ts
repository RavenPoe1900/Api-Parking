import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateReservationDto } from './create-reservation.dto';
import { ReservationStatus } from './reservationStatus.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateReservationDto extends PartialType(CreateReservationDto) {}

export class UpdateReservationStatusDto {
  /**
   * The status of the reservation.
   * Must be one of the following: RESERVED, CANCELLED, CHECKED_IN, CHECKED_OUT.
   * @example "CHECKED_IN"
   */
  @ApiProperty({
    description: 'The status of the reservation',
    enum: ReservationStatus,
    example: ReservationStatus.CHECKED_IN,
  })
  @IsEnum(ReservationStatus, {
    message:
      'Invalid status. Must be one of: RESERVED, CANCELLED, CHECKED_IN, CHECKED_OUT.',
  })
  @IsNotEmpty({ message: 'Status is required.' })
  status: ReservationStatus;
}
