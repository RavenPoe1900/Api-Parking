import { ApiProperty } from '@nestjs/swagger';
import { CreateVehicleDetailDto } from './create-vehicleDetail.dto';
import { IsInt, IsNotEmpty, IsNumber, Min } from 'class-validator';
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
  | 'user'
  | 'reservationId'
>;

export class ResponseVehicleDetailDto
  extends CreateVehicleDetailDto
  implements VehicleDetailContract
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
