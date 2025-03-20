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
import { PaginationReservationDto } from '../domain/pagination-reservation.dto';
import { IsNull } from 'typeorm';
import { Roles } from 'src/_shared/auth/domain/roles.decorator';
import { UpdateReservationDto } from '../domain/update-reservation.dto';
import { CreateReservationDto } from '../domain/create-reservation.dto';

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
  @HttpCode(HttpStatus.OK)
  @ApiResponseSwagger(findSwagger(ResponseReservationDto, controllerName))
  findAll(
    @Query() pagination: PaginationReservationDto,
  ): Promise<ResponseReservationDto[] | undefined> {
    return this.reservationsService.findAll({
      skip: ((pagination.page || 0) - 1) * (pagination.perPage || 50),
      take: pagination.perPage,
      where: {
        deletedBy: IsNull(),
        deletedAt: IsNull(),
      },
    });
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
    @Param('id') id: number,
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
    @Param('id') id: number,
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
   * Soft deletes a reservation.
   * @param id The ID of the reservation to delete.
   * @returns The soft-deleted reservation.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiResponseSwagger(deleteSwagger(ResponseReservationDto, controllerName))
  softDelete(
    @Param('id') id: number,
    @Request() req: RequestWithUser,
  ): Promise<ResponseReservationDto | null | undefined> {
    return this.reservationsService.softDelete(id, {
      userId: req.user.userId,
      parkingId: req.user.parkingId,
    });
  }
}
