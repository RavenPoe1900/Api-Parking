import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SignUpResponseDto {
  @ApiProperty({
    example: `User successfully registered`,
    description: 'Message',
  })
  @IsString()
  message: string;
}
