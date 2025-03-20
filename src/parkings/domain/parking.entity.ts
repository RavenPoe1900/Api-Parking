import { IBaseEntity } from 'src/_shared/domain/interface/baseEntity.interface';
import { Reservation } from 'src/reservations/domain/reservation.entity';
import { Entity, Column, OneToMany } from 'typeorm';

@Entity()
export class Parking extends IBaseEntity {
  @Column({ unique: true })
  name: string;

  @Column()
  totalSpots: number;

  @OneToMany(() => Reservation, (reservations) => reservations.parking)
  reservations: Reservation[];
}
