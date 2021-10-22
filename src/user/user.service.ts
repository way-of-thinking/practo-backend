import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from 'src/auth/jwt-payload.interface';
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

  async signIn({
    email,
    password,
  }: LoginInput): Promise<{ accessToken: string }> {
    try {
      const user = await this.users.findOne(
        { email },
        { select: ['id', 'password', 'salt'] },
      );
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const { id } = user;
      const payload: JwtPayload = { id };
      const accessToken = await this.jwtService.sign(payload);
      return { accessToken };
    } catch (error) {
      throw new Error(error);
    }
  }
}
