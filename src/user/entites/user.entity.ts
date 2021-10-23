import { InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CoreEntity } from 'src/common/entities/core.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, Index } from 'typeorm';
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
  @Index('UQ_user_email', { unique: true })
  @Column()
  email: string;

  @Column({  nullable: true })
  @Index('UQ_user_username', { unique: true })
  username: string;

  @Column({ default: '' })
  name: string;

  @Column({ select: false })
  password: string;

  @Column({ select: false })
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
      const hash = await bcrypt.hash(aPassword, this.salt);
      return hash === this.password;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
