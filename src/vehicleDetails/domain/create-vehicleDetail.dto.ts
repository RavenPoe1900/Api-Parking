import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsMongoId,
  IsString,
  Matches,
  IsNumber,
  Min,
} from 'class-validator';
import { VehicleDetail } from './vehicleDetail.entity';
import { User } from 'src/users/domain/user.entity';

type VehicleDetailContract = Omit<
  VehicleDetail,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'createdBy'
  | 'updatedBy'
  | 'deletedAt'
  | 'deletedBy'
  | 'parkings'
  | 'parkingId'
  | 'reservation'
  | 'reservationId'
  | 'user'
>;

export class CreateVehicleDetailDto implements VehicleDetailContract {
  /**
   * The license plate of the vehicle.
   * Must be a valid alphanumeric string with a length between 6 and 10 characters.
   * @example "ABC123"
   */
  @ApiProperty({
    description: 'The license plate of the vehicle.',
    example: 'ABC123',
  })
  @IsString({ message: 'License plate must be a string.' })
  @Matches(/^[A-Za-z0-9]{6,10}$/, {
    message:
      'License plate must be alphanumeric and between 6 to 10 characters long.',
  })
  @IsNotEmpty({ message: 'License plate is required.' })
  licensePlate: string;

  /**
   * The brand of the vehicle.
   * @example "Toyota"
   */
  @ApiProperty({
    description: 'The brand of the vehicle.',
    example: 'Toyota',
  })
  @IsString({ message: 'Brand must be a string.' })
  @IsNotEmpty({ message: 'Brand is required.' })
  brand: string;

  /**
   * The model of the vehicle.
   * @example "Corolla"
   */
  @ApiProperty({
    description: 'The model of the vehicle.',
    example: 'Corolla',
  })
  @IsString({ message: 'Model must be a string.' })
  @IsNotEmpty({ message: 'Model is required.' })
  model: string;

  /**
   * The ID of the user who owns the vehicle.
   * @example "1"
   */
  @ApiProperty({
    description: 'The ID of the user who owns the vehicle.',
    example: '1',
  })
  @Min(1)
  @IsNumber()
  @IsNotEmpty({ message: 'User ID is required.' })
  userId: number;
}
