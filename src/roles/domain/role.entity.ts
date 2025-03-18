import { BaseEntityInterface } from 'src/_shared/domain/interface/baseEntity.interface';
import { User } from 'src/users/domain/user.entity';
import { Entity, Column, OneToMany } from 'typeorm';

@Entity()
export class Role extends BaseEntityInterface {
  @Column({ unique: true })
  name: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
