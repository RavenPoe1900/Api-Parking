import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class StatusSummaryResponseDto {
  /**
   * The number of reservations with the status "RESERVED".
   * @example 5
   */
  @ApiProperty({
    description: 'The number of reservations with the status "RESERVED".',
    example: 5,
    minimum: 0,
  })
  @IsInt({ message: 'RESERVED must be an integer.' })
  @Min(0, { message: 'RESERVED must be a non-negative integer.' })
  RESERVED: number;

  /**
   * The number of reservations with the status "CHECKED_IN".
   * @example 3
   */
  @ApiProperty({
    description: 'The number of reservations with the status "CHECKED_IN".',
    example: 3,
    minimum: 0,
  })
  @IsInt({ message: 'CHECKED_IN must be an integer.' })
  @Min(0, { message: 'CHECKED_IN must be a non-negative integer.' })
  CHECKED_IN: number;

  /**
   * The number of reservations with the status "CHECKED_OUT".
   * @example 2
   */
  @ApiProperty({
    description: 'The number of reservations with the status "CHECKED_OUT".',
    example: 2,
    minimum: 0,
  })
  @IsInt({ message: 'CHECKED_OUT must be an integer.' })
  @Min(0, { message: 'CHECKED_OUT must be a non-negative integer.' })
  CHECKED_OUT: number;

  /**
   * The number of reservations with the status "CANCELLED".
   * @example 1
   */
  @ApiProperty({
    description: 'The number of reservations with the status "CANCELLED".',
    example: 1,
    minimum: 0,
  })
  @IsInt({ message: 'CANCELLED must be an integer.' })
  @Min(0, { message: 'CANCELLED must be a non-negative integer.' })
  CANCELLED: number;
}
