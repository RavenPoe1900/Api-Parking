import { Module } from '@nestjs/common';
import { RolesModule } from './roles/roles.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from './_shared/domain/db/databaseConfig';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { getJwtConfig } from './_shared/domain/jwt/jwtConfig';
import { AuthModule } from './_shared/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './_shared/auth/application/auth.guard';
import { RolesGuard } from './_shared/auth/application/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(getDatabaseConfig()),
    JwtModule.register(getJwtConfig()),
    RolesModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
