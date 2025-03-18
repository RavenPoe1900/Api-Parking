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
import { CreateUserDto } from '../domain/create-user.dto';
import { UsersService } from '../application/users.service';
import { ApiResponseSwagger } from 'src/_shared/domain/swagger/response.swagger';
import {
  createSwagger,
  deleteSwagger,
  findOneSwagger,
  findSwagger,
  updateSwagger,
} from 'src/_shared/domain/swagger/http.swagger';
import { ResponseUserDto } from '../domain/response-user.dto';
import { UpdateUserDto } from '../domain/update-user.dto';
import { RequestWithUser } from 'src/_shared/domain/type/requestWithUser.type';
import { PaginationUserDto } from '../domain/pagination-user.dto';
import { IsNull } from 'typeorm';

const controllerName = 'Users';

@ApiTags('Users')
@Controller({
  path: 'users/',
  version: '1',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Crea un nuevo rol.
   * @param createUserDto Los datos para crear el rol.
   * @returns El rol creado.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponseSwagger(createSwagger(ResponseUserDto, controllerName))
  async create(
    @Body() createUserDto: CreateUserDto,
    @Request() req: RequestWithUser,
  ): Promise<ResponseUserDto | ResponseUserDto[] | undefined> {
    return this.usersService.create(
      createUserDto,
      1,
      1,
      // req.user.id,
      // req.user.parkingId,
    );
  }

  /**
   * Obtiene todos los users con filtros opcionales.
   * @returns Una lista de users.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponseSwagger(findSwagger(ResponseUserDto, controllerName))
  async findAll(
    @Query() pagination: PaginationUserDto,
    @Request() req: RequestWithUser,
  ): Promise<ResponseUserDto[] | undefined> {
    return this.usersService.findAll({
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
  @ApiResponseSwagger(findOneSwagger(ResponseUserDto, controllerName))
  async findOneById(
    @Param('id') id: number,
    @Request() req: RequestWithUser,
  ): Promise<ResponseUserDto | null | undefined> {
    return this.usersService.findOneById(id, req.user.parkingId);
  }

  /**
   * Actualiza un rol existente.
   * @param id El ID del rol a actualizar.
   * @param updateUserDto Los datos para actualizar el rol.
   * @returns El rol actualizado.
   */
  @Patch(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiResponseSwagger(updateSwagger(ResponseUserDto, controllerName))
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: RequestWithUser,
  ): Promise<ResponseUserDto | null | undefined> {
    return this.usersService.update(
      id,
      updateUserDto,
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
  @ApiResponseSwagger(deleteSwagger(ResponseUserDto, controllerName))
  async softDelete(
    @Param('id') id: number,
    @Request() req: RequestWithUser,
  ): Promise<ResponseUserDto | null | undefined> {
    return this.usersService.softDelete(
      id,
      1,
      1,
      // req.user.id ? req.user.id : 1,
      // req.user.parkingId ? req.user.parkingId : 1,
    );
  }
}
