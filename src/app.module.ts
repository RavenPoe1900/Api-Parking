import { Module } from '@nestjs/common';
import { RolesModule } from './roles/roles.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getPostgresConfig } from './_shared/domain/db/postgresConfig.db';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { getJwtConfig } from './_shared/domain/jwt/jwtConfig';
import { AuthModule } from './_shared/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './_shared/auth/application/auth.guard';
import { RolesGuard } from './_shared/auth/application/roles.guard';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongoConfig } from './_shared/domain/db/mongoConfig.db';
import { VehicleDetailsModule } from './vehicleDetails/vehicleDetails.module';
import { ParkingsModule } from './parkings/parkings.module';
import { ReservationsModule } from './reservations/reservations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync(getMongoConfig()),
    TypeOrmModule.forRoot(getPostgresConfig()),
    JwtModule.register(getJwtConfig()),
    RolesModule,
    UsersModule,
    AuthModule,
    VehicleDetailsModule,
    ParkingsModule,
    ReservationsModule,
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
