import { ApiProperty } from '@nestjs/swagger';
import { CreateReservationDto } from './create-reservation.dto';
import { IsInt, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Reservation } from './reservation.entity';

type ReservationContract = Omit<
  Reservation,
  | 'parking'
  | 'vehicleDetail'
  | 'user'
  | 'createdAt'
  | 'updatedAt'
  | 'createdBy'
  | 'updatedBy'
  | 'deletedAt'
  | 'deletedBy'
  | 'validateReservationDates'
>;

export class ResponseReservationDto
  extends CreateReservationDto
  implements ReservationContract
{
  @ApiProperty({
    description: 'Unique ID of the resource',
    example: 1,
    type: Number,
    required: true,
  })
  @IsNumber({}, { message: 'ID must be a valid number' })
  @Min(1, { message: 'ID must be greater than or equal to 1' })
  id: number;

  /**
   * @example 1
   * @description The ID of the parking lot. Must be a positive integer.
   */
  @ApiProperty({
    example: 1,
    description: 'The ID of the parking lot. Must be a positive integer.',
    minimum: 1,
    type: Number,
  })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  parkingId: number;
}
