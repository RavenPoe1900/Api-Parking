import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { Role } from './role.entity';

type RoleContract = Omit<
  Role,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'createdBy'
  | 'updatedBy'
  | 'deletedAt'
  | 'deletedBy'
  | 'users'
  | 'parkingId'
>;

export class CreateRoleDto implements RoleContract {
  /**
   * Name of the role.
   * @example "Admin"
   * @description The name must be a non-empty string, between 3 and 50 characters long,
   * and can only contain alphanumeric characters, spaces, underscores, and hyphens.
   */
  @ApiProperty({
    example: 'Admin',
    description:
      'Name of the role. Must be a non-empty string, between 3 and 50 characters long.',
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name cannot be empty' })
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  @MaxLength(50, { message: 'Name cannot exceed 50 characters' })
  @Matches(/^[a-zA-Z0-9_\- ]+$/, {
    message:
      'Name can only contain alphanumeric characters, spaces, underscores, and hyphens',
  })
  name: string;
}
