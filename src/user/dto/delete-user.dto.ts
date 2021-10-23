import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteUser {
  @IsNotEmpty()
  @IsNumber()
  readonly id: number;
}
