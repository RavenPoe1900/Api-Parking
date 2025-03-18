import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no definidas en el DTO
      forbidNonWhitelisted: true, // Lanza un error si hay propiedades no permitidas
      transform: true, // Transforma los datos de entrada al tipo especificado en el DTO
    }),
  );

  app.use(cookieParser());
  app.enableCors({});
  app.use(helmet());

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('API de Roles y Usuarios')
    .setDescription('API para gestionar roles y usuarios con soft delete')
    .setVersion('1.0')
    .addTag('roles', 'Gestión de roles')
    .addTag('users', 'Gestión de usuarios')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
