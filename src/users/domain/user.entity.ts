import { BaseEntityInterface } from 'src/_shared/domain/interface/baseEntity.interface';
import { Role } from 'src/roles/domain/role.entity';
import { Entity, Column, ManyToOne, Index } from 'typeorm';

@Entity()
export class User extends BaseEntityInterface {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @ManyToOne(() => Role, (role) => role.users)
  @Index()
  role: Role;

  @Column({ nullable: true })
  roleId: number;
}
