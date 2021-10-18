import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountInput } from './dto/create-account.dto';
import { User } from './entites/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly user: Repository<User>,
  ) {}

  async signUp(createAccountInput: CreateAccountInput) {
    const { name, email, password, role } = createAccountInput;

    const user = new User();
    user.email = email;
  }
}
