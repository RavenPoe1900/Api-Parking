import { ApiProperty } from '@nestjs/swagger';
import { CreateRoleDto } from './create-role.dto';
import { IsNumber, Min } from 'class-validator';
import { Role } from './role.entity';

type RoleContract = Omit<
  Role,
  | 'users'
  | 'name'
  | 'createdAt'
  | 'updatedAt'
  | 'createdBy'
  | 'updatedBy'
  | 'deletedAt'
  | 'deletedBy'
  | 'parkingId'
>;

export class ResponseRoleDto extends CreateRoleDto implements RoleContract {
  @ApiProperty({
    description: 'Unique ID of the resource',
    example: 1,
    type: Number,
    required: true,
  })
  @IsNumber({}, { message: 'ID must be a valid number' })
  @Min(1, { message: 'ID must be greater than or equal to 1' })
  id: number;
}
