import { IsIn, IsNotEmpty, IsNumber } from 'class-validator';
import { UserRole } from '../entites/user.entity';

export class SetUserRole {
  @IsNotEmpty()
  @IsNumber()
  readonly id: number;

  @IsIn([UserRole.Admin, UserRole.User, UserRole.Supervisor])
  readonly role: UserRole;
}
