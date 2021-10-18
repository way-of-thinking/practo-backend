import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountInput } from './dto/create-account.dto';
import { LoginInput } from './dto/login.dto';
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
        //dublicate email
        throw new ConflictException('Email alredy exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn({ email, password }: LoginInput) {
    try {
      const user = await this.users.findOne(
        { email },
        { select: ['id', 'password'] },
      );
      if (!user) {
        return { ok: false, error: 'User not found' };
      }
      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return { ok: false, error: 'Wrong password' };
      }
      // const token = this.jwtService.sign(user.id);
      return { ok: true, user };
    } catch (error) {
      return { ok: false, error: "Can't log user in." };
    }
  }
}
