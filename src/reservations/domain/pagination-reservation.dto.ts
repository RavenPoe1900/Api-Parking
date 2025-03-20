import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/_shared/domain/dto/pagination.dto';

export class PaginationReservationDto extends PaginationDto {
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
  @IsOptional()
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
  @IsOptional()
  reservationEnd: Date;
}

export type PaginatedResult<T> = {
  data: T[];
  total: number;
};
