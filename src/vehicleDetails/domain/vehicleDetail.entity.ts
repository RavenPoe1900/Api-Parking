import { Exclude } from 'class-transformer';
import { IBaseEntity } from 'src/_shared/domain/interface/baseEntity.interface';
import { Reservation } from 'src/reservations/domain/reservation.entity';
import { User } from 'src/users/domain/user.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class VehicleDetail extends IBaseEntity {
  @Column()
  licensePlate: string;

  @Column()
  brand: string;

  @Column()
  model: string;

  @ManyToOne(() => User, (user) => user.vehicleDetails)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Reservation, (reservation) => reservation.vehicleDetail)
  @JoinColumn({ name: 'reservationId' })
  @Exclude()
  reservation: Reservation;

  @Column({ nullable: true })
  reservationId: number;
}
