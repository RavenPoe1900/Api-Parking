import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsInt, Min } from 'class-validator';
import { User } from './user.entity';

type UserContract = Omit<
  User,
  | 'createdAt'
  | 'updatedAt'
  | 'createdBy'
  | 'updatedBy'
  | 'deletedAt'
  | 'deletedBy'
  | 'id'
  | 'role'
  | 'parkingId'
>;
export class CreateUserDto implements UserContract {
  /**
   * @example 'John Doe'
   * @description The name of the user.
   */
  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the user.',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * @example 'john.doe@example.com'
   * @description The email address of the user. Must be a valid email format.
   */
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email address of the user. Must be a valid email format.',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * @example 'password123'
   * @description The password for the user account. Must be a non-empty string.
   */
  @ApiProperty({
    example: 'password123',
    description:
      'The password for the user account. Must be a non-empty string.',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  /**
   * @example 1
   * @description The ID of the role assigned to the user. Must be a positive integer.
   */
  @ApiProperty({
    example: 1,
    description:
      'The ID of the role assigned to the user. Must be a positive integer.',
  })
  @IsInt()
  @Min(1)
  roleId: number;
}
