import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsDateString, Min, IsInt } from 'class-validator';
import { Reservation } from './reservation.entity';

type ReservationContract = Omit<
  Reservation,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'createdBy'
  | 'updatedBy'
  | 'deletedAt'
  | 'deletedBy'
  | 'users'
  | 'parkingId'
  | 'parking'
  | 'vehicleDetail'
  | 'user'
  | 'validateReservationDates'
>;

export class CreateReservationDto implements ReservationContract {
  /**
   * The ID of the user who made the reservation.
   * @example "1"
   */
  @ApiProperty({
    description: 'The ID of the user who made the reservation.',
    example: 1,
  })
  @Min(1, { message: 'User ID must be at least 1.' })
  @IsInt({ message: 'User ID must be an integer.' })
  @IsNotEmpty({ message: 'User ID is required.' })
  userId: number;

  /**
   * The ID of the vehicle associated with the reservation.
   * @example "1"
   */
  @ApiProperty({
    description: 'The ID of the vehicle associated with the reservation.',
    example: 3,
  })
  @Min(1, { message: 'Vehicle ID must be at least 1.' })
  @IsInt({ message: 'Vehicle ID must be an integer.' })
  @IsNotEmpty({ message: 'Vehicle ID is required.' })
  vehicleId: number;

  /**
   * The start date and time of the reservation.
   * @example "2023-10-10T10:00:00Z"
   */
  @ApiProperty({
    description: 'The start date and time of the reservation.',
    example: '2023-10-10T10:00:00Z',
  })
  @IsDateString(
    {},
    { message: 'Reservation start must be a valid ISO date string.' },
  )
  @IsNotEmpty({ message: 'Reservation start is required.' })
  reservationStart: Date;

  /**
   * The end date and time of the reservation.
   * @example "2023-10-10T12:00:00Z"
   */
  @ApiProperty({
    description: 'The end date and time of the reservation.',
    example: '2023-10-10T12:00:00Z',
  })
  @IsDateString(
    {},
    { message: 'Reservation end must be a valid ISO date string.' },
  )
  @IsNotEmpty({ message: 'Reservation end is required.' })
  reservationEnd: Date;
}
