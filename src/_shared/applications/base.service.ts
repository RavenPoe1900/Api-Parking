import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  Repository,
  FindManyOptions,
  DeepPartial,
  QueryFailedError,
  IsNull,
  FindOptionsWhere,
} from 'typeorm';
import { BaseTInterface } from '../domain/interface/baseT.interface';

@Injectable()
export abstract class BaseService<T extends BaseTInterface> {
  constructor(private readonly repository: Repository<T>) {}
  /**
   * Genera un objeto `FindOptionsWhere` para usar como filtro en consultas TypeORM.
   * @param id El ID del registro a filtrar.
   * @param parkingId El ID del estacionamiento asociado.
   * @returns Un objeto `FindOptionsWhere` con las condiciones especificadas.
   */
  protected generateWhereFilter(
    id: number,
    parkingId: number,
  ): FindOptionsWhere<T> {
    return {
      id: id as any,
      deletedBy: IsNull() as any,
      deletedAt: IsNull() as any,
      parkingId: parkingId as any,
    };
  }
  /**
   * Crea un nuevo registro.
   * @param createDto Los datos para crear el registro.
   * @param userId ID del usuario que crea el registro.
   * @param parkingId ID del estacionamiento asociado.
   * @returns El registro creado.
   */
  async create(
    createDto: DeepPartial<T>,
    userId: number,
    parkingId: number,
  ): Promise<T | T[] | undefined> {
    try {
      createDto.createdBy = userId;
      createDto.parkingId = parkingId;
      const entity = this.repository.create(createDto as any);
      return await this.repository.save(entity);
    } catch (error) {
      this.handleError(error, 'Error al crear el registro');
    }
  }

  /**
   * Encuentra todos los registros con filtros opcionales.
   * @param filters Opciones de búsqueda (filtros, relaciones, ordenamiento, etc.).
   * @returns Una lista de registros.
   */
  async findAll(filters: FindManyOptions<T> = {}): Promise<T[] | undefined> {
    try {
      return await this.repository.find(filters);
    } catch (error) {
      this.handleError(error, 'Error al buscar registros');
    }
  }

  /**
   * Encuentra un registro por su ID.
   * @param id El ID del registro.
   * @returns El registro encontrado.
   * @throws NotFoundException si el registro no existe.
   */
  async findOneById(
    id: number,
    parkingId: number,
  ): Promise<T | null | undefined> {
    let entity: T | null | undefined;
    try {
      entity = await this.repository.findOneBy(
        this.generateWhereFilter(id, parkingId),
      );
    } catch (error) {
      this.handleError(error, 'Error al buscar el registro por ID');
    }
    if (!entity) {
      throw new NotFoundException(`El registro con ID ${id} no existe`);
    }
    return entity;
  }

  /**
   * Actualiza un registro existente.
   * @param id El ID del registro a actualizar.
   * @param updateDto Los datos para actualizar el registro.
   * @returns El registro actualizado.
   */
  async update(
    id: number,
    updateDto: DeepPartial<T>,
    userId: number,
    parkingId: number,
  ): Promise<T | null | undefined> {
    updateDto.updatedBy = userId;
    try {
      await this.repository.update(
        this.generateWhereFilter(id, parkingId),
        updateDto as any,
      );
    } catch (error) {
      this.handleError(error, 'Error al actualizar el registro');
    }
    return await this.findOneById(id, parkingId);
  }

  /**
   * Elimina un registro (soft delete).
   * @param id El ID del registro a eliminar.
   * @returns El registro eliminado.
   */
  softDelete(
    id: number,
    userId: number,
    parkingId: number,
  ): Promise<T | null | undefined> {
    return this.update(
      id,
      {
        deletedAt: new Date(),
        deletedBy: userId,
      } as DeepPartial<T>,
      userId,
      parkingId,
    );
  }

  // /**
  //  * Restaura un registro eliminado (soft delete).
  //  * @param id El ID del registro a restaurar.
  //  * @returns El registro restaurado.
  //  */
  // async restore(id: number): Promise<T | null | undefined> {
  //   try {
  //     await this.repository.restore(id);
  //     return await this.findOneById(id);
  //   } catch (error) {
  //     this.handleError(error, 'Error al restaurar el registro');
  //   }
  // }

  /**
   * Manejador de errores genérico.
   * @param error El error capturado.
   * @param message Mensaje personalizado para el error.
   */
  private handleError(
    error: unknown,
    message: string = 'Ocurrió un error inesperado',
  ): void {
    console.error(`[ERROR] ${message}:`, error);

    if (error instanceof QueryFailedError) {
      const details = (error as any).detail
        ? `, detalles: ${(error as any).detail}`
        : '';
      throw new InternalServerErrorException(
        `Error en la base de datos: ${error.message}${details}`,
      );
    }

    // Para otros tipos de errores
    throw new InternalServerErrorException(message);
  }
}
