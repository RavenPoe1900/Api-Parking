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

const controllerName = 'Roles';

@ApiTags('Roles')
@Controller({
  path: 'roles/',
  version: '1',
})
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  /**
   * Crea un nuevo rol.
   * @param createRoleDto Los datos para crear el rol.
   * @returns El rol creado.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponseSwagger(createSwagger(ResponseRoleDto, controllerName))
  async create(
    @Body() createRoleDto: CreateRoleDto,
    @Request() req: RequestWithUser,
  ): Promise<ResponseRoleDto | ResponseRoleDto[] | undefined> {
    return this.rolesService.create(
      createRoleDto,
      1,
      1,
      // req.user.id,
      // req.user.parkingId,
    );
  }

  /**
   * Obtiene todos los roles con filtros opcionales.
   * @returns Una lista de roles.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponseSwagger(findSwagger(ResponseRoleDto, controllerName))
  async findAll(
    @Query() pagination: PaginationRoleDto,
    @Request() req: RequestWithUser,
  ): Promise<ResponseRoleDto[] | undefined> {
    return this.rolesService.findAll({
      skip: pagination.page,
      take: pagination.perPage,
      where: {
        // parkingId: req.user.parkingId,
        parkingId: 1,
        deletedBy: IsNull(),
        deletedAt: IsNull(),
      },
    });
  }

  /**
   * Obtiene un rol por su ID.
   * @param id El ID del rol.
   * @returns El rol encontrado o null si no existe.
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponseSwagger(findOneSwagger(ResponseRoleDto, controllerName))
  async findOneById(
    @Param('id') id: number,
    @Request() req: RequestWithUser,
  ): Promise<ResponseRoleDto | null | undefined> {
    return this.rolesService.findOneById(id, req.user.parkingId);
  }

  /**
   * Actualiza un rol existente.
   * @param id El ID del rol a actualizar.
   * @param updateRoleDto Los datos para actualizar el rol.
   * @returns El rol actualizado.
   */
  @Patch(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiResponseSwagger(updateSwagger(ResponseRoleDto, controllerName))
  async update(
    @Param('id') id: number,
    @Body() updateRoleDto: UpdateRoleDto,
    @Request() req: RequestWithUser,
  ): Promise<ResponseRoleDto | null | undefined> {
    return this.rolesService.update(
      id,
      updateRoleDto,
      1,
      1,
      // req.user.id ? req.user.id : 1,
      // req.user.parkingId ? req.user.parkingId : 1,
    );
  }

  /**
   * Elimina un rol (soft delete).
   * @param id El ID del rol a eliminar.
   * @returns El rol eliminado.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiResponseSwagger(deleteSwagger(ResponseRoleDto, controllerName))
  async softDelete(
    @Param('id') id: number,
    @Request() req: RequestWithUser,
  ): Promise<ResponseRoleDto | null | undefined> {
    return this.rolesService.softDelete(
      id,
      1,
      1,
      // req.user.id ? req.user.id : 1,
      // req.user.parkingId ? req.user.parkingId : 1,
    );
  }
}
