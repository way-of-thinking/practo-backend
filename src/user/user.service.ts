import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountInput } from './dto/create-account.dto';
import { LoginInput } from './dto/login.dto';
import { User } from './entites/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private jwtService: JwtService,
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
        { select: ['id', 'password', 'salt'] },
      );
      if (!user) {
        return { error: 'User not found' };
      }
      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return { error: 'Wrong password' };
      }
      delete user.password;
      delete user.salt;
      // const token = this.jwtService.sign(user.id);
      return { ok: true, user };
    } catch (error) {
      return { error: "Can't log user in." };
    }
  }
}
