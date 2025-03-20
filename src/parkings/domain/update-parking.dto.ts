import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateParkingDto } from './create-parking.dto';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateParkingDto extends PartialType(CreateParkingDto) {
  /**
   * The number of available parking spots in real-time.
   * Must be a non-negative integer and cannot exceed the total spots.
   * @example 45
   */
  @ApiProperty({
    description: 'The number of available parking spots in real-time.',
    example: 45,
  })
  @IsNumber({}, { message: 'Available spots must be a number.' })
  @Min(0, { message: 'Available spots cannot be negative.' })
  @IsOptional({ message: 'Available spots is required.' })
  availableSpots: number;
}
