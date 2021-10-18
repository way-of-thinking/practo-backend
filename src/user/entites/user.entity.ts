import { InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CoreEntity } from 'src/common/entities/core.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
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

  @Column({ default: '' })
  name: string;

  @Column({ select: false })
  password: string;

  @Column()
  salt: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.User })
  role: UserRole;

  @Column({ default: false })
  verified: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        const salt = await bcrypt.genSalt();
        this.salt = salt;
        this.password = await bcrypt.hash(this.password, salt);
      } catch (error) {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare(aPassword, this.salt);
      return ok;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
