import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Patch,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReservationsService } from '../application/reservations.service';
import { ApiResponseSwagger } from 'src/_shared/domain/swagger/response.swagger';
import {
  createSwagger,
  deleteSwagger,
  findOneSwagger,
  findSwagger,
  updateSwagger,
} from 'src/_shared/domain/swagger/http.swagger';
import { ResponseReservationDto } from '../domain/response-reservation.dto';
import { RequestWithUser } from 'src/_shared/domain/type/requestWithUser.type';
import {
  PaginatedResult,
  PaginationReservationDto,
} from '../domain/pagination-reservation.dto';
import { Roles } from 'src/_shared/auth/domain/roles.decorator';
import {
  UpdateReservationDto,
  UpdateReservationStatusDto,
} from '../domain/update-reservation.dto';
import { CreateReservationDto } from '../domain/create-reservation.dto';
import { Reservation } from '../domain/reservation.entity';
import { GetStatusSummaryDto } from '../domain/getStatusSummary.dto';
import { ReservationStatus } from '../domain/reservationStatus.enum';
import { PositiveIntPipe } from 'src/_shared/domain/pipes/positive-int.pipe';

const controllerName = 'reservations';

@ApiTags('reservations')
@Controller({
  path: 'reservations/',
  version: '1',
})
@Roles('admin')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  /**
   * Creates a new reservation.
   * @param createreservationDto The data to create the reservation.
   * @returns The created reservation.
   */
  @Post()
  @Roles('client', 'admin')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponseSwagger(createSwagger(ResponseReservationDto, controllerName))
  create(
    @Body() createReservationDto: CreateReservationDto,
    @Request() req: RequestWithUser,
  ): Promise<ResponseReservationDto | ResponseReservationDto[] | undefined> {
    return this.reservationsService.createReservation(
      createReservationDto,
      req.user,
    );
  }

  /**
   * Retrieves all reservations with optional filters.
   * @returns A list of reservations.
   */
  @Get()
  @Roles('employer', 'admin')
  @HttpCode(HttpStatus.OK)
  @ApiResponseSwagger(findSwagger(ResponseReservationDto, controllerName))
  findAll(
    @Query() pagination: PaginationReservationDto,
  ): Promise<PaginatedResult<Reservation>> {
    return this.reservationsService.findAllReservations(pagination);
  }

  /**
   * Retrieves the count of reservations grouped by status, optionally filtered by parkingId.
   * @param query - Optional query parameters (e.g., parkingId).
   * @returns An object with the count of each status.
   */
  @Get('status-summary')
  @HttpCode(HttpStatus.OK)
  @ApiResponseSwagger(updateSwagger(ResponseReservationDto, controllerName))
  async getStatusSummary(
    @Query() query: GetStatusSummaryDto,
  ): Promise<Record<ReservationStatus, number>> {
    return this.reservationsService.getStatusSummary(query.parkingId);
  }

  /**
   * Retrieves a reservation by its ID.
   * @param id The ID of the reservation.
   * @returns The found reservation or null if it does not exist.
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponseSwagger(findOneSwagger(ResponseReservationDto, controllerName))
  findOneById(
    @Param('id', PositiveIntPipe) id: number,
    @Request() req: RequestWithUser,
  ): Promise<ResponseReservationDto | null | undefined> {
    return this.reservationsService.findOneById(id, req.user.parkingId, true);
  }

  /**
   * Updates an existing reservation.
   * @param id The ID of the reservation to update.
   * @param updatereservationDto The data to update the reservation.
   * @returns The updated reservation.
   */
  @Patch(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiResponseSwagger(updateSwagger(ResponseReservationDto, controllerName))
  update(
    @Param('id', PositiveIntPipe) id: number,
    @Body() updatereservationDto: UpdateReservationDto,
    @Request() req: RequestWithUser,
  ): Promise<ResponseReservationDto | null | undefined> {
    return this.reservationsService.updateReservation(
      id,
      updatereservationDto,
      req.user,
    );
  }

  /**
   * Updates the status of a reservation.
   * @param id - The ID of the reservation to update.
   * @param updateReservationStatusDto - The new status for the reservation.
   * @returns The updated reservation.
   * @throws BadRequestException if the status transition is invalid.
   */
  @Patch('/status/:id')
  @Roles('client', 'admin')
  @HttpCode(HttpStatus.OK)
  @ApiResponseSwagger(updateSwagger(ResponseReservationDto, controllerName))
  updateReservationStatus(
    @Param('id', PositiveIntPipe) id: number,
    @Body() updateReservationStatusDto: UpdateReservationStatusDto,
    @Request() req: RequestWithUser,
  ) {
    return this.reservationsService.updateReservationStatus(
      id,
      updateReservationStatusDto.status,
      {
        userId: req.user.userId,
        parkingId: req.user.parkingId,
      },
    );
  }

  /**
   * Soft deletes a reservation.
   * @param id The ID of the reservation to delete.
   * @returns The soft-deleted reservation.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiResponseSwagger(deleteSwagger(ResponseReservationDto, controllerName))
  softDelete(
    @Param('id', PositiveIntPipe) id: number,
    @Request() req: RequestWithUser,
  ): Promise<ResponseReservationDto | null | undefined> {
    return this.reservationsService.softDelete(id, {
      userId: req.user.userId,
      parkingId: req.user.parkingId,
    });
  }
}
