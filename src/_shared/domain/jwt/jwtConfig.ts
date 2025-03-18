import { JwtModuleOptions } from '@nestjs/jwt';

export function getJwtConfig(): JwtModuleOptions {
  return {
    global: true,
    secret: process.env.SECRET ?? 'default_secret',
    signOptions: { expiresIn: process.env.EXPIRESIN ?? '1h' },
  };
}
