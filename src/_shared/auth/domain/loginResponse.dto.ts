import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginResponseDto {
  @ApiProperty({
    example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
    .eyJ1c2VySWQiOjEsInJlc3RhdXJhbnRJZCI6MSwicm9sZU5hbWUiOiJh
    ZG1pbiIsImlhdCI6MTczMDY0MTAwMywiZXhwIjoxNzMyMjM5NDAzfQ
    .YbW-WOEvVxcDr3PRbWz5Bjq3QRKM9fVGjn1gp9eAevc`,
    description: 'Api access token',
  })
  @IsString()
  access_token: string;
}
