import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min, IsString } from 'class-validator';
import { Parking } from './parking.entity';

type ParkingContract = Omit<
  Parking,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'createdBy'
  | 'updatedBy'
  | 'deletedAt'
  | 'deletedBy'
  | 'reservations'
  | 'parkingId'
>;

export class CreateParkingDto implements ParkingContract {
  /**
   * The name of the parking lot.
   * @example "Main Parking Lot"
   */
  @ApiProperty({
    description: 'The name of the parking lot.',
    example: 'Main Parking Lot',
  })
  @IsString({ message: 'Name must be a string.' })
  @IsNotEmpty({ message: 'Name is required.' })
  name: string;

  /**
   * The total number of parking spots available in the parking lot.
   * Must be a positive integer greater than 0.
   * @example 50
   */
  @ApiProperty({
    description:
      'The total number of parking spots available in the parking lot.',
    example: 50,
  })
  @IsNumber({}, { message: 'Total spots must be a number.' })
  @Min(1, { message: 'Total spots must be at least 1.' })
  @IsNotEmpty({ message: 'Total spots is required.' })
  totalSpots: number;
}
