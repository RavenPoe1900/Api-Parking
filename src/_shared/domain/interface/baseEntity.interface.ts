import { Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { IBaseT } from './baseT.interface';

export class IBaseEntity implements IBaseT {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({ nullable: true })
  createdBy: number;

  @Column({ nullable: true })
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
