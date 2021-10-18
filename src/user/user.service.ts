import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountInput } from './dto/create-account.dto';
import { User } from './entites/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async signUp({ name, email, password, role }: CreateAccountInput) {
    try {
      await this.users.save(this.users.create({ name, email, password, role }));
    } catch (error) {
      if (error.code === '23505') {
        //dublicate username
        throw new ConflictException('Username alredy exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
