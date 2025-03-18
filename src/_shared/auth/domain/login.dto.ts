import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseUserDto } from 'src/_shared/domain/dto/baseUser.dto';

export class LoginDto extends BaseUserDto {
  /**
   * @example 1
   * @description The ID of the parking lot associated with the user. Must be a positive integer.
   * This field is optional and defaults to null if not provided.
   */
  @ApiProperty({
    description: 'The ID of the parking lot associated with the user',
    required: false,
    example: 1,
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'Parking ID must be a valid number' },
  )
  @Min(1, { message: 'Parking ID must be a positive integer' })
  parkingId: number;
}
