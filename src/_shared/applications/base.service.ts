import {
  BadRequestException,
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
  FindOneOptions,
  UpdateResult,
} from 'typeorm';
import { IBaseT } from '../domain/interface/baseT.interface';
import { IUserParking } from '../domain/interface/userParking.interface';
import { LogsService } from 'src/logs/application/logs.service';
import { CreateLogDto } from 'src/logs/domain/create-logs.dto';
import { Reservation } from 'src/reservations/domain/reservation.entity';

@Injectable()
export abstract class BaseService<T extends IBaseT> {
  constructor(
    protected readonly repository: Repository<T>,
    protected readonly logsService: LogsService,
  ) {}

  /**
   * Generates a `FindOptionsWhere` object to use as a filter in TypeORM queries.
   * @param id The ID of the record to filter.
   * @param parkingId The ID of the associated parking.
   * @returns A `FindOptionsWhere` object with the specified conditions.
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
   * Creates a new record.
   * @param createDto The data to create the record.
   * @param userPerking User and parking information (userId, parkingId).
   * @returns The created record.
   */
  async create(
    createDto: DeepPartial<T>,
    userPerking: IUserParking,
  ): Promise<T | T[] | undefined> {
    try {
      createDto.createdBy = userPerking.userId;
      createDto.parkingId = userPerking.parkingId;
      const entity = this.repository.create(createDto as any);
      return await this.repository.save(entity);
    } catch (error) {
      await this.handleError(error, 'Error creating the record');
    }
  }

  /**
   * Creates a new record if it does not already exist.
   * @param filters Filters to search for the existing record.
   * @param data Data to create the new record.
   * @returns The existing record or the newly created record.
   */
  async createIfNotExists(
    filters: Record<string, any>,
    data: DeepPartial<T>,
  ): Promise<T> {
    const existingEntity = await this.repository.findOneBy(filters as any);
    if (existingEntity) {
      return existingEntity;
    }
    const newEntity = this.repository.create(data);
    return this.repository.save(newEntity);
  }

  /**
   * Finds all records with optional filters.
   * @param filters Search options (filters, relations, ordering, etc.).
   * @returns A list of records.
   */
  async findAll(filters: FindManyOptions<T> = {}): Promise<T[] | undefined> {
    try {
      return await this.repository.find(filters);
    } catch (error) {
      await this.handleError(error, 'Error searching for records');
    }
  }

  /**
   * Finds a record based on optional filters.
   * @param filters Search options (can include conditions, relations, etc.).
   * @returns The found record.
   * @throws NotFoundException if the record does not exist.
   */
  async findOneBy(filters: FindOneOptions<T> = {}): Promise<T> {
    let entity: T | null | undefined;
    try {
      entity = await this.repository.findOne(filters);
    } catch (error) {
      await this.handleError(error, 'Error searching for the record');
    }

    if (!entity) {
      throw new NotFoundException('The record does not exist');
    }

    return entity;
  }

  /**
   * Finds a record by its ID.
   * @param id The ID of the record.
   * @returns The found record.
   * @throws NotFoundException if the record does not exist.
   */
  async findOneById(
    id: number,
    parkingId: number,
    filter?: boolean,
  ): Promise<T | null | undefined> {
    let entity: T | null | undefined;
    try {
      entity = await this.repository.findOne({
        where: filter
          ? this.generateWhereFilter(id, parkingId)
          : { id: id as any },
      });
    } catch (error) {
      await this.handleError(error, 'Error searching for the record by ID');
    }
    if (!entity) {
      throw new NotFoundException(`The record with ID ${id} does not exist`);
    }
    return entity;
  }

  /**
   * Updates an existing record.
   * @param id The ID of the record to update.
   * @param updateDto The data to update the record.
   * @returns The updated record.
   */
  async update(
    id: number,
    updateDto: DeepPartial<T>,
    userPerking: IUserParking,
    findOptionsWhere?: FindOptionsWhere<T>,
  ): Promise<T | null | undefined> {
    updateDto.updatedBy = userPerking.userId;
    updateDto.updatedAt = new Date();
    let result: UpdateResult | null = null;
    try {
      const whereFilter: FindOptionsWhere<T> = {
        ...this.generateWhereFilter(id, userPerking.parkingId),
        ...findOptionsWhere,
      };
      result = await this.repository.update(whereFilter, updateDto as any);
    } catch (error) {
      await this.handleError(error, 'Error updating the record');
    }
    if (!result || result.affected === 0) {
      throw new BadRequestException('The search preconditions were not met.');
    }
    return await this.findOneById(id, userPerking.parkingId, true);
  }

  /**
   * Soft deletes a record.
   * @param id The ID of the record to delete.
   * @returns The deleted record.
   */
  async softDelete(
    id: number,
    userPerking: IUserParking,
  ): Promise<T | null | undefined> {
    const data = {
      deletedAt: new Date(),
      deletedBy: userPerking.userId,
    } as DeepPartial<T>;
    try {
      await this.repository.update(
        this.generateWhereFilter(id, userPerking.parkingId),
        data as any,
      );
    } catch (error) {
      await this.handleError(error, 'Error updating the record');
    }
    return await this.findOneById(id, userPerking.parkingId);
  }

  /**
   * Generic error handler.
   * @param error The caught error.
   * @param message Custom message for the error.
   */
  private async handleError(
    error: any,
    message: string = 'An unexpected error occurred',
  ): Promise<void> {
    console.error(`[ERROR] ${message}:`, error);

    const logDto: CreateLogDto = {
      level: 'error', // Nivel del log (puedes ajustarlo según tus necesidades)
      message: `Database error: ${error instanceof Error ? error.message : String(error)}`,
    };

    if (error instanceof QueryFailedError) {
      const details = (error as any).detail
        ? `, details: ${(error as any).detail}`
        : '';
      logDto.message += details;
      await this.logsService.create(logDto);

      throw new BadRequestException(
        `Database error: ${error.message}${details}`,
      );
    }
    await this.logsService.create(logDto);
    if (
      error.message ==
      'TotalSpots must be greater than or equal to availableSpots'
    )
      throw new BadRequestException(`Database error: ${error.message}`);
    throw new InternalServerErrorException(message);
  }
}
