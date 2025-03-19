import { ConfigModule, ConfigService } from '@nestjs/config';
import * as mongoose from 'mongoose';

export function getMongoConfig() {
  return {
    imports: [ConfigModule], // Importa el módulo de configuración
    useFactory: async (configService: ConfigService) => {
      try {
        // Obtener la URI de MongoDB desde las variables de entorno
        const mongoUri =
          configService.get<string>('MONGO_URI') ||
          'mongodb://localhost:27017/nestjs-logs';

        // Validar que la URI no esté vacía
        if (!mongoUri) {
          throw new Error(
            'La variable de entorno MONGO_URI no está configurada.',
          );
        }

        // Opciones recomendadas para la conexión de MongoDB
        const mongoOptions: mongoose.ConnectOptions = {
          autoCreate: true, // Crea automáticamente la base de datos si no existe
          connectTimeoutMS: 5000, // Tiempo de espera para la conexión
          socketTimeoutMS: 30000, // Tiempo de espera para operaciones en el socket
        };

        // Conectar a MongoDB
        await mongoose.connect(mongoUri, mongoOptions);

        console.log('Conexión exitosa a MongoDB');
        return { uri: mongoUri };
      } catch (error) {
        console.error('Error al conectar a MongoDB:', error.message);
        throw error; // Lanza el error para que sea manejado por NestJS
      }
    },
    inject: [ConfigService], // Inyecta el servicio de configuración
  };
}
