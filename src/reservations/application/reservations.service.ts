import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { toZonedTime, format } from 'date-fns-tz';
import { ConfigService } from '@nestjs/config';
import { BaseService } from 'src/_shared/applications/base.service';
import { Reservation } from '../domain/reservation.entity';
import { LogsService } from 'src/logs/application/logs.service';
import { IPayload } from 'src/_shared/domain/interface/payload.interface';
import { CreateReservationDto } from '../domain/create-reservation.dto';
import { UpdateReservationDto } from '../domain/update-reservation.dto';
import { ResponseReservationDto } from '../domain/response-reservation.dto';
import {
  PaginatedResult,
  PaginationReservationDto,
} from '../domain/pagination-reservation.dto';

@Injectable()
export class ReservationsService extends BaseService<Reservation> {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    protected readonly logsService: LogsService,
    private readonly configService: ConfigService,
  ) {
    super(reservationRepository, logsService);
  }

  /**
   * Creates a new reservation if parking spots are available.
   * @param createReservationDto - Data for creating the reservation.
   * @param payload - User and parking context (e.g., userId, parkingId).
   * @returns A response DTO representing the created reservation or undefined if creation fails.
   */
  async createReservation(
    createReservationDto: CreateReservationDto,
    payload: IPayload,
  ): Promise<ResponseReservationDto | undefined> {
    await this.ifAvailableParking(
      payload.parkingId,
      createReservationDto.reservationStart,
      createReservationDto.reservationEnd,
    );

    const reservation = await this.create(createReservationDto, {
      userId: payload.userId,
      parkingId: payload.parkingId,
    });

    if (reservation && !(reservation instanceof Array)) {
      return this.toResponseReservationDto(reservation);
    }

    return undefined;
  }

  /**
   * Retrieves a paginated list of reservations filtered by date range and sorted by start time.
   * @param paginationDto - Pagination parameters including page, perPage, and optional date filters.
   * @returns A paginated result containing the reservations and total count.
   */
  async findAllReservations(
    paginationDto: PaginationReservationDto,
  ): Promise<PaginatedResult<Reservation>> {
    const { page, perPage, reservationStart, reservationEnd } = paginationDto;

    // Get the configured time zone or default to 'America/New_York'
    const timeZone =
      this.configService.get<string>('TIME_ZONE') || 'America/New_York';

    const skip = ((page || 1) - 1) * (perPage || 50);

    // Convert reservation dates to the specified time zone
    const localReservationStart = this.convertToTimeZone(
      reservationStart,
      timeZone,
    );
    const localReservationEnd = this.convertToTimeZone(
      reservationEnd,
      timeZone,
    );

    const query = this.reservationRepository.createQueryBuilder('r');

    // Apply date filters if provided
    if (localReservationStart && localReservationEnd) {
      query
        .where('r.reservationStart <= :reservationEnd', {
          reservationEnd: localReservationEnd,
        })
        .andWhere('r.reservationEnd >= :reservationStart', {
          reservationStart: localReservationStart,
        });
    } else if (localReservationStart) {
      query.where('r.reservationEnd >= :reservationStart', {
        reservationStart: localReservationStart,
      });
    } else if (localReservationEnd) {
      query.where('r.reservationStart <= :reservationEnd', {
        reservationEnd: localReservationEnd,
      });
    }

    // Order, paginate, and execute the query
    query.orderBy('r.reservationStart', 'ASC').skip(skip).take(perPage);

    const [data, total] = await query.getManyAndCount();

    return { data, total };
  }

  /**
   * Updates an existing reservation if parking spots are available for the new date range.
   * @param id - The ID of the reservation to update.
   * @param updateReservationDto - Data for updating the reservation.
   * @param payload - User and parking context (e.g., userId, parkingId).
   * @returns A response DTO representing the updated reservation or null/undefined if update fails.
   */
  async updateReservation(
    id: number,
    updateReservationDto: UpdateReservationDto,
    payload: IPayload,
  ): Promise<ResponseReservationDto | null | undefined> {
    // Check if either reservationStart or reservationEnd is provided
    if (
      updateReservationDto.reservationStart ||
      updateReservationDto.reservationEnd
    ) {
      if (
        !updateReservationDto.reservationStart ||
        !updateReservationDto.reservationEnd
      ) {
        // Fetch existing reservation to fill missing fields
        const existingReservation = await this.reservationRepository.findOne({
          where: { id },
        });
        if (!existingReservation) {
          throw new BadRequestException('The reservation does not exist.');
        }
        updateReservationDto.reservationStart =
          updateReservationDto.reservationStart ||
          existingReservation.reservationStart;
        updateReservationDto.reservationEnd =
          updateReservationDto.reservationEnd ||
          existingReservation.reservationEnd;
      }
      // Validate parking availability for the new date range
      await this.ifAvailableParking(
        payload.parkingId,
        updateReservationDto.reservationStart,
        updateReservationDto.reservationEnd,
      );
    }

    return await this.update(id, updateReservationDto, {
      userId: payload.userId,
      parkingId: payload.parkingId,
    });
  }

  /**
   * Checks if there are available parking spots for the given date range.
   * @param parkingId - The ID of the parking lot.
   * @param reservationStart - Start date of the reservation.
   * @param reservationEnd - End date of the reservation.
   * @throws BadRequestException if the parking does not exist or no spots are available.
   */
  private async ifAvailableParking(
    parkingId: number,
    reservationStart: Date,
    reservationEnd: Date,
  ): Promise<void> {
    // Get the configured time zone or default to 'America/New_York'
    const timeZone =
      this.configService.get<string>('TIME_ZONE') || 'America/New_York';

    // Convert reservation dates to the specified time zone
    const localReservationStart = this.convertToTimeZone(
      reservationStart,
      timeZone,
    );
    const localReservationEnd = this.convertToTimeZone(
      reservationEnd,
      timeZone,
    );

    // Query to check parking availability
    const query = `
      SELECT 
        p."totalSpots",
        COUNT(r."id") AS "overlappingReservationsCount"
      FROM "parking" p
      LEFT JOIN "reservation" r
        ON p."id" = r."parkingId"
        AND $2 <= r."reservationEnd"
        AND $3 >= r."reservationStart"
      WHERE p."id" = $1
      GROUP BY p."id", p."totalSpots"
    `;

    const result = await this.reservationRepository.query(query, [
      parkingId,
      localReservationStart,
      localReservationEnd,
    ]);

    if (!result || result.length === 0) {
      throw new BadRequestException('The parking does not exist.');
    }

    const totalSpots = Number(result[0].totalSpots);
    const overlappingReservationsCount = Number(
      result[0].overlappingReservationsCount,
    );

    if (overlappingReservationsCount >= totalSpots) {
      throw new BadRequestException(
        'No parking spots are available for the specified date range.',
      );
    }
  }

  /**
   * Converts a Reservation entity to a ResponseReservationDto.
   * @param reservation - The Reservation entity to convert.
   * @returns A ResponseReservationDto object.
   */
  private toResponseReservationDto(
    reservation: Reservation,
  ): ResponseReservationDto {
    return {
      id: reservation.id,
      parkingId: reservation.parkingId,
      userId: reservation.userId,
      vehicleId: reservation.vehicleId,
      reservationStart: reservation.reservationStart,
      reservationEnd: reservation.reservationEnd,
    };
  }

  /**
   * Converts a UTC date to a formatted string in the specified time zone.
   * @param date - The UTC date to convert.
   * @param timeZone - The target time zone (e.g., 'America/New_York').
   * @returns A formatted date string in the specified time zone.
   */
  private convertToTimeZone(date: Date, timeZone: string): string {
    if (!date) return '';
    const zonedDate = toZonedTime(date, timeZone);
    return format(zonedDate, 'yyyy-MM-dd HH:mm:ss', { timeZone });
  }
}
