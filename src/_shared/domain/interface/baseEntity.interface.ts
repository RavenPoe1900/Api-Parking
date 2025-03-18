import { Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTInterface } from './baseT.interface';

export class BaseEntityInterface implements BaseTInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({ nullable: true })
  createdBy: number;

  @Column()
  parkingId: number;

  @Column({ nullable: true })
  updatedAt?: Date;

  @Column({ nullable: true })
  updatedBy?: number;

  @Column({ nullable: true })
  deletedAt?: Date;

  @Column({ nullable: true })
  deletedBy?: number;
}
