import { Module } from '@nestjs/common';
import { RolesModule } from './roles/roles.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from './_shared/domain/db/databaseConfig';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { getJwtConfig } from './_shared/domain/jwt/jwtConfig';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(getDatabaseConfig()),
    JwtModule.register(getJwtConfig()),
    RolesModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
