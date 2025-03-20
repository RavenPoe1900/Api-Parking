import { IBaseEntity } from 'src/_shared/domain/interface/baseEntity.interface';
import { Parking } from 'src/parkings/domain/parking.entity';
import { User } from 'src/users/domain/user.entity';
import { VehicleDetail } from 'src/vehicleDetails/domain/vehicleDetail.entity';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

@Entity()
export class Reservation extends IBaseEntity {
  @ManyToOne(() => User, (user) => user.reservations)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @Column()
  vehicleId: number;

  @ManyToOne(() => Parking, (parking) => parking.reservations)
  @JoinColumn({ name: 'parkingId' })
  parking: Parking;

  @OneToMany(() => VehicleDetail, (vehicleDetail) => vehicleDetail.reservation)
  vehicleDetail: VehicleDetail[];

  @Column()
  reservationStart: Date;

  @Column()
  reservationEnd: Date;

  @AfterLoad()
  @BeforeInsert()
  @BeforeUpdate()
  validateReservationDates() {
    if (this.reservationStart > this.reservationEnd) {
      throw new Error(
        'reservationStart must be less than or equal to reservationEnd',
      );
    }
  }
}
