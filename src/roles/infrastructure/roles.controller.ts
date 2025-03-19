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
import { CreateRoleDto } from '../domain/create-role.dto';
import { RolesService } from '../application/roles.service';
import { ApiResponseSwagger } from 'src/_shared/domain/swagger/response.swagger';
import {
  createSwagger,
  deleteSwagger,
  findOneSwagger,
  findSwagger,
  updateSwagger,
} from 'src/_shared/domain/swagger/http.swagger';
import { ResponseRoleDto } from '../domain/response-role.dto';
import { UpdateRoleDto } from '../domain/update-role.dto';
import { RequestWithUser } from 'src/_shared/domain/type/requestWithUser.type';
import { PaginationRoleDto } from '../domain/pagination-role.dto';
import { IsNull } from 'typeorm';
import { Roles } from 'src/_shared/auth/domain/roles.decorator';

const controllerName = 'Roles';

@ApiTags('Roles')
@Controller({
  path: 'roles/',
  version: '1',
})
@Roles('admin')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  /**
   * Creates a new role.
   * @param createRoleDto The data to create the role.
   * @returns The created role.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponseSwagger(createSwagger(ResponseRoleDto, controllerName))
  async create(
    @Body() createRoleDto: CreateRoleDto,
    @Request() req: RequestWithUser,
  ): Promise<ResponseRoleDto | ResponseRoleDto[] | undefined> {
    return this.rolesService.create(createRoleDto, {
      userId: req.user.userId,
      parkingId: req.user.parkingId,
    });
  }

  /**
   * Retrieves all roles with optional filters.
   * @returns A list of roles.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponseSwagger(findSwagger(ResponseRoleDto, controllerName))
  async findAll(
    @Query() pagination: PaginationRoleDto,
  ): Promise<ResponseRoleDto[] | undefined> {
    return this.rolesService.findAll({
      skip: (pagination.page || 0 - 1) * (pagination.perPage || 1),
      take: pagination.perPage,
      where: {
        deletedBy: IsNull(),
        deletedAt: IsNull(),
      },
    });
  }

  /**
   * Retrieves a role by its ID.
   * @param id The ID of the role.
   * @returns The found role or null if it does not exist.
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponseSwagger(findOneSwagger(ResponseRoleDto, controllerName))
  async findOneById(
    @Param('id') id: number,
    @Request() req: RequestWithUser,
  ): Promise<ResponseRoleDto | null | undefined> {
    return this.rolesService.findOneById(id, req.user.parkingId, true);
  }

  /**
   * Updates an existing role.
   * @param id The ID of the role to update.
   * @param updateRoleDto The data to update the role.
   * @returns The updated role.
   */
  @Patch(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiResponseSwagger(updateSwagger(ResponseRoleDto, controllerName))
  async update(
    @Param('id') id: number,
    @Body() updateRoleDto: UpdateRoleDto,
    @Request() req: RequestWithUser,
  ): Promise<ResponseRoleDto | null | undefined> {
    return this.rolesService.update(id, updateRoleDto, {
      userId: req.user.userId,
      parkingId: req.user.parkingId,
    });
  }

  /**
   * Soft deletes a role.
   * @param id The ID of the role to delete.
   * @returns The soft-deleted role.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiResponseSwagger(deleteSwagger(ResponseRoleDto, controllerName))
  async softDelete(
    @Param('id') id: number,
    @Request() req: RequestWithUser,
  ): Promise<ResponseRoleDto | null | undefined> {
    return this.rolesService.softDelete(id, {
      userId: req.user.userId,
      parkingId: req.user.parkingId,
    });
  }
}
