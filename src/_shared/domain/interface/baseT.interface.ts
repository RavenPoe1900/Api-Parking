import { ObjectLiteral } from 'typeorm';

export interface IBaseT extends ObjectLiteral {
  id: number;
  parkingId: number;
  createdAt: Date;
  createdBy: number;
  updatedAt?: Date | null;
  updatedBy?: number | null;
  deletedAt?: Date | null;
  deletedBy?: number | null;
}
