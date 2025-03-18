import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../domain/roles.decorator';
import { UsersService } from 'src/users/application/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoleNames = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoleNames || requiredRoleNames.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const user = await this.usersService.findOneBy({
      where: { id: request.user.userId },
      relations: ['role'],
    });

    if (!user) {
      throw new Error('User not found');
    }

    return requiredRoleNames.some((role) => user.role.name?.includes(role));
  }
}
