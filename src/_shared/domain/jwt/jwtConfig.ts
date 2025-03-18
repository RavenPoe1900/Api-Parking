import { JwtModuleOptions } from '@nestjs/jwt';

export function getJwtConfig(): JwtModuleOptions {
  return {
    global: true,
    secret: process.env.SECRET ?? 'default_secret', // Valor predeterminado si no está definido
    signOptions: { expiresIn: process.env.EXPIRESIN ?? '1h' }, // Valor predeterminado: '1h'
  };
}
