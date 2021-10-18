import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity } from 'typeorm';

export enum UserRole {
  Admin = 'Admin',
  User = 'User',
  Doctor = 'Doctor',
  Supervisor = 'Supervisor',
  MaketingManager = 'MaketingManager',
  ProductManager = 'ProductManager',
  ProjectManager = 'ProjectManager',
  FinanceManager = 'FinanceManager',
}

@Entity({ name: 'users' })
export class User extends CoreEntity {
  @Column({ unique: true })
  email: string;

  @Column({ unique: true, nullable: true })
  username: string;

  @Column()
  name: string;

  @Column({ select: false })
  password: string;

  @Column()
  salt: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.User })
  role: UserRole;

  @Column({ default: false })
  verified: boolean;
}
