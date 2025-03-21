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
import { Roles } from 'src/_shared/auth/domain/roles.decorator';
import { PositiveIntPipe } from 'src/_shared/domain/pipes/positive-int.pipe';

const controllerName = 'Users';

@ApiTags('Users')
@Controller({
  path: 'users/',
  version: '1',
})
@Roles('admin')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Creates a new user.
   * @param createUserDto Data required to create the user.
   * @param req Request object containing user context.
   * @returns The created user.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponseSwagger(createSwagger(ResponseUserDto, controllerName))
  create(
    @Body() createUserDto: CreateUserDto,
    @Request() req: RequestWithUser,
  ): Promise<ResponseUserDto | ResponseUserDto[] | undefined> {
    return this.usersService.create(createUserDto, {
      userId: req.user.userId,
      parkingId: req.user.parkingId,
    });
  }

  /**
   * Retrieves all users with optional filters.
   * @param pagination Pagination options (page, perPage).
   * @param req Request object containing user context.
   * @returns A list of users.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponseSwagger(findSwagger(ResponseUserDto, controllerName))
  findAll(
    @Query() pagination: PaginationUserDto,
    @Request() req: RequestWithUser,
  ): Promise<ResponseUserDto[] | undefined> {
    return this.usersService.findAll({
      skip: ((pagination.page || 0) - 1) * (pagination.perPage || 50),
      take: pagination.perPage,
      where: {
        parkingId: req.user.parkingId,
        deletedBy: IsNull(),
        deletedAt: IsNull(),
      },
    });
  }

  /**
   * Retrieves a user by its ID.
   * @param id The unique identifier of the user.
   * @param req Request object containing user context.
   * @returns The found user or null if it does not exist.
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponseSwagger(findOneSwagger(ResponseUserDto, controllerName))
  findOneById(
    @Param('id', PositiveIntPipe) id: number,
    @Request() req: RequestWithUser,
  ): Promise<ResponseUserDto | null | undefined> {
    return this.usersService.findOneById(id, req.user.parkingId, true);
  }

  /**
   * Updates an existing user.
   * @param id The unique identifier of the user to update.
   * @param updateUserDto Data required to update the user.
   * @param req Request object containing user context.
   * @returns The updated user.
   */
  @Patch(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiResponseSwagger(updateSwagger(ResponseUserDto, controllerName))
  update(
    @Param('id', PositiveIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: RequestWithUser,
  ): Promise<ResponseUserDto | null | undefined> {
    return this.usersService.update(id, updateUserDto, {
      userId: req.user.userId,
      parkingId: req.user.parkingId,
    });
  }

  /**
   * Soft deletes a user (marks it as deleted without removing it from the database).
   * @param id The unique identifier of the user to delete.
   * @param req Request object containing user context.
   * @returns The soft-deleted user.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiResponseSwagger(deleteSwagger(ResponseUserDto, controllerName))
  softDelete(
    @Param('id', PositiveIntPipe) id: number,
    @Request() req: RequestWithUser,
  ): Promise<ResponseUserDto | null | undefined> {
    return this.usersService.softDelete(id, {
      userId: req.user.userId,
      parkingId: req.user.parkingId,
    });
  }
}
