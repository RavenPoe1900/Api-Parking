import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/application/users.service';
import { IUserAuth } from '../domain/userAuth.interface';
import { hashPassword, validatePassword } from 'src/_shared/applications/hash';
import { IPayload } from 'src/_shared/domain/interface/payload.interface';
import { DeepPartial, FindOneOptions } from 'typeorm';
import { User } from 'src/users/domain/user.entity';
import { LoginDto } from '../domain/login.dto';
import { ResponseUserDto } from 'src/users/domain/response-user.dto';
import { plainToInstance } from 'class-transformer';
import { RolesService } from 'src/roles/application/roles.service';
import { ParkingsService } from 'src/parkings/application/parkings.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private parkingsService: ParkingsService,
    private rolesService: RolesService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    let user: IUserAuth;
    const findUser: FindOneOptions<User> = {
      where: { email: loginDto.email },
      select: {
        id: true,
        parkingId: true,
        password: true,
        role: {
          name: true,
        },
      },
      relations: ['role'],
    };

    try {
      user = (await this.usersService.findOneBy(findUser)) as IUserAuth;
    } catch (e) {
      if (e.message === 'Entity not found') throw new UnauthorizedException();
      throw e;
    }

    if (!(await validatePassword(loginDto.password, user.password))) {
      throw new UnauthorizedException();
    }
    await this.parkingsService.findOneById(
      loginDto.parkingId,
      loginDto.parkingId,
    );

    const payload: IPayload = {
      userId: user.id,
      parkingId: loginDto.parkingId,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(signUpDto: LoginDto): Promise<ResponseUserDto> {
    const role = await this.rolesService.findOneBy({
      where: { name: 'client' },
    });
    const userdata: DeepPartial<User> = {
      password: await hashPassword(signUpDto.password),
      email: signUpDto.email,
      roleId: role.id,
    };
    const user = await this.usersService.create(userdata, {
      parkingId: signUpDto.parkingId,
    });

    return plainToInstance(ResponseUserDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
