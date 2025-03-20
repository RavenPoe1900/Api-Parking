import { IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetStatusSummaryDto {
  /**
   * Optional parking ID to filter the results.
   * @example 123
   */
  @ApiProperty({
    description: 'Optional parking ID to filter the results.',
    required: false,
    example: 123,
  })
  @IsOptional()
  @IsInt({ message: 'parkingId must be an integer.' })
  @Min(1, { message: 'parkingId must be a positive integer.' })
  parkingId?: number;
}
