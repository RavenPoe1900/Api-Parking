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

  async updateReservation(
    id: number,
    updateReservationDto: UpdateReservationDto,
    payload: IPayload,
  ): Promise<ResponseReservationDto | null | undefined> {
    if (updateReservationDto.reservationStart || updateReservationDto.reservationEnd) {
      if (
        !updateReservationDto.reservationStart ||
        !updateReservationDto.reservationEnd
      ) {
        const existingReservation = await this.reservationRepository.findOne({ where: { id } });
        if (!existingReservation) {
          throw new BadRequestException('La reserva no existe.');
        }
        updateReservationDto.reservationStart =
          updateReservationDto.reservationStart || existingReservation.reservationStart;
        updateReservationDto.reservationEnd =
          updateReservationDto.reservationEnd || existingReservation.reservationEnd;
      }
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
   * Verifica si en el rango de fechas especificado existe disponibilidad en el parking.
   *
   * Se convierte el rango de fechas (que llega en UTC) a la zona horaria definida en la configuración
   * para poder compararlo con las fechas almacenadas en la base de datos.
   */
  private async ifAvailableParking(
    parkingId: number,
    reservationStart: Date,
    reservationEnd: Date,
  ): Promise<void> {
    const timeZone = this.configService.get<string>('TIME_ZONE') || 'America/New_York';

    const localReservationStart = this.convertToTimeZone(reservationStart, timeZone);
    const localReservationEnd = this.convertToTimeZone(reservationEnd, timeZone);

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
      throw new BadRequestException('El parking no existe.');
    }

    const totalSpots = Number(result[0].totalSpots);
    const overlappingReservationsCount = Number(result[0].overlappingReservationsCount);

    if (overlappingReservationsCount >= totalSpots) {
      throw new BadRequestException(
        'No hay plazas disponibles en el rango de fechas especificado.',
      );
    }
  }

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
   * Convierte una fecha (en UTC) a un string formateado en la zona horaria especificada.
   */
  private convertToTimeZone(date: Date, timeZone: string): string {
    const zonedDate = toZonedTime(date, timeZone);
    return format(zonedDate, 'yyyy-MM-dd HH:mm:ss', { timeZone });
  }
}