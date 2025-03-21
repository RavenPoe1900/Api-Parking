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
import { ApiResponseSwagger } from 'src/_shared/domain/swagger/response.swagger';
import {
  createSwagger,
  deleteSwagger,
  findOneSwagger,
  findSwagger,
  updateSwagger,
} from 'src/_shared/domain/swagger/http.swagger';
import { ResponseVehicleDetailDto } from '../domain/response-vehicleDetail.dto';
import { RequestWithUser } from 'src/_shared/domain/type/requestWithUser.type';
import { PaginationVehicleDetailDto } from '../domain/pagination-vehicleDetail.dto';
import { IsNull } from 'typeorm';
import { Roles } from 'src/_shared/auth/domain/roles.decorator';
import { UpdateVehicleDetailDto } from '../domain/update-vehicleDetail.dto';
import { CreateVehicleDetailDto } from '../domain/create-vehicleDetail.dto';
import { VehicleDetailsService } from '../application/vehicleDetails.service';
import { PositiveIntPipe } from 'src/_shared/domain/pipes/positive-int.pipe';

const controllerName = 'VehicleDetails';

@ApiTags('VehicleDetails')
@Controller({
  path: 'vehicleDetails/',
  version: '1',
})
@Roles('admin')
export class VehicleDetailsController {
  constructor(private readonly vehicleDetailsService: VehicleDetailsService) {}

  /**
   * Creates a new vehicleDetail.
   * @param createvehicleDetailDto The data to create the vehicleDetail.
   * @returns The created vehicleDetail.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponseSwagger(createSwagger(ResponseVehicleDetailDto, controllerName))
  create(
    @Body() createVehicleDetailDto: CreateVehicleDetailDto,
    @Request() req: RequestWithUser,
  ): Promise<
    ResponseVehicleDetailDto | ResponseVehicleDetailDto[] | undefined
  > {
    return this.vehicleDetailsService.create(createVehicleDetailDto, {
      userId: req.user.userId,
      parkingId: req.user.parkingId,
    });
  }

  /**
   * Retrieves all vehicleDetails with optional filters.
   * @returns A list of vehicleDetails.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponseSwagger(findSwagger(ResponseVehicleDetailDto, controllerName))
  findAll(
    @Query() pagination: PaginationVehicleDetailDto,
  ): Promise<ResponseVehicleDetailDto[] | undefined> {
    return this.vehicleDetailsService.findAll({
      skip: ((pagination.page || 0) - 1) * (pagination.perPage || 50),
      take: pagination.perPage,
      where: {
        deletedBy: IsNull(),
        deletedAt: IsNull(),
      },
    });
  }

  /**
   * Retrieves a vehicleDetail by its ID.
   * @param id The ID of the vehicleDetail.
   * @returns The found vehicleDetail or null if it does not exist.
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponseSwagger(findOneSwagger(ResponseVehicleDetailDto, controllerName))
  findOneById(
    @Param('id', PositiveIntPipe) id: number,
    @Request() req: RequestWithUser,
  ): Promise<ResponseVehicleDetailDto | null | undefined> {
    return this.vehicleDetailsService.findOneById(id, req.user.parkingId, true);
  }

  /**
   * Updates an existing vehicleDetail.
   * @param id The ID of the vehicleDetail to update.
   * @param updatevehicleDetailDto The data to update the vehicleDetail.
   * @returns The updated vehicleDetail.
   */
  @Patch(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiResponseSwagger(updateSwagger(ResponseVehicleDetailDto, controllerName))
  update(
    @Param('id', PositiveIntPipe) id: number,
    @Body() updatevehicleDetailDto: UpdateVehicleDetailDto,
    @Request() req: RequestWithUser,
  ): Promise<ResponseVehicleDetailDto | null | undefined> {
    return this.vehicleDetailsService.update(id, updatevehicleDetailDto, {
      userId: req.user.userId,
      parkingId: req.user.parkingId,
    });
  }

  /**
   * Soft deletes a vehicleDetail.
   * @param id The ID of the vehicleDetail to delete.
   * @returns The soft-deleted vehicleDetail.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiResponseSwagger(deleteSwagger(ResponseVehicleDetailDto, controllerName))
  softDelete(
    @Param('id', PositiveIntPipe) id: number,
    @Request() req: RequestWithUser,
  ): Promise<ResponseVehicleDetailDto | null | undefined> {
    return this.vehicleDetailsService.softDelete(id, {
      userId: req.user.userId,
      parkingId: req.user.parkingId,
    });
  }
}
