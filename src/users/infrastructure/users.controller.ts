import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from '../application/users.service';
import { User } from '../domain/user.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //   @Post()
  //   @ApiOperation({ summary: 'Crear un nuevo usuario' })
  //   @ApiResponse({ status: 201, description: 'Usuario creado exitosamente', type: User })
  //   async create(@Body() createUserDto: CreateUserDto): Promise<User> {
  //     return this.usersService.create(createUserDto);
  //   }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios', type: [User] })
  async findAll(): Promise<User[] | undefined> {
    return this.usersService.findAll();
  }
}
