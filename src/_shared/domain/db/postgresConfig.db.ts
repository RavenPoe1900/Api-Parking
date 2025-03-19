import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function getPostgresConfig(): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB_NAME,
    autoLoadEntities: true,
    synchronize: process.env.NODE_ENV === 'development',
  };
}
