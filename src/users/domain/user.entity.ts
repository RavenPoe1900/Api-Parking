import { IBaseEntity } from 'src/_shared/domain/interface/baseEntity.interface';
import { Reservation } from 'src/reservations/domain/reservation.entity';
import { Role } from 'src/roles/domain/role.entity';
import { VehicleDetail } from 'src/vehicleDetails/domain/vehicleDetail.entity';
import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity()
export class User extends IBaseEntity {
  @Column({ nullable: true })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @OneToMany(() => VehicleDetail, (vehicleDetail) => vehicleDetail.user)
  vehicleDetails: VehicleDetail[];

  @OneToMany(() => Reservation, (reservations) => reservations.user)
  reservations: Reservation[];

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @Column({ nullable: true })
  roleId: number;
}
