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
import { ParkingsService } from '../application/parkings.service';
import { ApiResponseSwagger } from 'src/_shared/domain/swagger/response.swagger';
import {
  createSwagger,
  deleteSwagger,
  findOneSwagger,
  findSwagger,
  updateSwagger,
} from 'src/_shared/domain/swagger/http.swagger';
import { ResponseParkingDto } from '../domain/response-parking.dto';
import { RequestWithUser } from 'src/_shared/domain/type/requestWithUser.type';
import { PaginationParkingDto } from '../domain/pagination-parking.dto';
import { IsNull } from 'typeorm';
import { Roles } from 'src/_shared/auth/domain/roles.decorator';
import { UpdateParkingDto } from '../domain/update-parking.dto';
import { CreateParkingDto } from '../domain/create-parking.dto';
import { PositiveIntPipe } from 'src/_shared/domain/pipes/positive-int.pipe';

const controllerName = 'Parkings';

@ApiTags('Parkings')
@Controller({
  path: 'parkings/',
  version: '1',
})
@Roles('admin')
export class ParkingsController {
  constructor(private readonly parkingsService: ParkingsService) {}

  /**
   * Creates a new parking.
   * @param createparkingDto The data to create the parking.
   * @returns The created parking.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponseSwagger(createSwagger(ResponseParkingDto, controllerName))
  create(
    @Body() createParkingDto: CreateParkingDto,
    @Request() req: RequestWithUser,
  ): Promise<ResponseParkingDto | ResponseParkingDto[] | undefined> {
    return this.parkingsService.create(createParkingDto, {
      userId: req.user.userId,
      parkingId: req.user.parkingId,
    });
  }

  /**
   * Retrieves all parkings with optional filters.
   * @returns A list of parkings.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponseSwagger(findSwagger(ResponseParkingDto, controllerName))
  findAll(
    @Query() pagination: PaginationParkingDto,
  ): Promise<ResponseParkingDto[] | undefined> {
    return this.parkingsService.findAll({
      skip: ((pagination.page || 0) - 1) * (pagination.perPage || 50),
      take: pagination.perPage,
      where: {
        deletedBy: IsNull(),
        deletedAt: IsNull(),
      },
    });
  }

  /**
   * Retrieves a parking by its ID.
   * @param id The ID of the parking.
   * @returns The found parking or null if it does not exist.
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponseSwagger(findOneSwagger(ResponseParkingDto, controllerName))
  findOneById(
    @Param('id', PositiveIntPipe) id: number,
    @Request() req: RequestWithUser,
  ): Promise<ResponseParkingDto | null | undefined> {
    return this.parkingsService.findOneById(id, req.user.parkingId, true);
  }

  /**
   * Updates an existing parking.
   * @param id The ID of the parking to update.
   * @param updateparkingDto The data to update the parking.
   * @returns The updated parking.
   */
  @Patch(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiResponseSwagger(updateSwagger(ResponseParkingDto, controllerName))
  update(
    @Param('id', PositiveIntPipe) id: number,
    @Body() updateparkingDto: UpdateParkingDto,
    @Request() req: RequestWithUser,
  ): Promise<ResponseParkingDto | null | undefined> {
    return this.parkingsService.update(id, updateparkingDto, {
      userId: req.user.userId,
      parkingId: req.user.parkingId,
    });
  }

  /**
   * Soft deletes a parking.
   * @param id The ID of the parking to delete.
   * @returns The soft-deleted parking.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiResponseSwagger(deleteSwagger(ResponseParkingDto, controllerName))
  softDelete(
    @Param('id', PositiveIntPipe) id: number,
    @Request() req: RequestWithUser,
  ): Promise<ResponseParkingDto | null | undefined> {
    return this.parkingsService.softDelete(id, {
      userId: req.user.userId,
      parkingId: req.user.parkingId,
    });
  }
}
