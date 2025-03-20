import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';
import { User } from './user.entity';
import { BaseUserDto } from 'src/_shared/domain/dto/baseUser.dto';
import { Expose } from 'class-transformer';

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
  | 'vehicleDetails'
  | 'reservations'
>;
export class CreateUserDto extends BaseUserDto implements UserContract {
  /**
   * @example 'John Doe'
   * @description The name of the user.
   */
  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the user.',
  })
  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * @example 1
   * @description The ID of the role assigned to the user. Must be a positive integer.
   */
  @ApiProperty({
    example: 1,
    description:
      'The ID of the role assigned to the user. Must be a positive integer.',
  })
  @Expose()
  @IsInt()
  @Min(1)
  roleId: number;
}
