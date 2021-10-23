import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from 'src/auth/jwt-payload.interface';
import { Repository } from 'typeorm';
import { CreateAccountInput } from './dto/create-account.dto';
import { LoginInput } from './dto/login.dto';
import { UpdateAccountInput } from './dto/update-account.dto';
import { User } from './entites/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp({
    name,
    email,
    password,
    role,
  }: CreateAccountInput): Promise<{ accessToken: string }> {
    try {
      const user = await this.users.save(
        this.users.create({ name, email, password, role }),
      );
      const payload: JwtPayload = { id: user.id };
      const accessToken = await this.jwtService.sign(payload);
      return { accessToken };
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
    const payload: JwtPayload = { id: user.id };
    const accessToken = await this.jwtService.sign(payload);
    return { accessToken };
  }

  async updateAccount(
    { name, email, username, password }: UpdateAccountInput,
    userId: User,
  ): Promise<User> {
    try {
      const user = await this.users.findOne(userId);
      user.name = name;
      user.email = email;
      user.username = username;
      if (password) {
        user.password = password;
      }
      await this.users.save(user);
      delete user.password;
      delete user.salt;
      return user;
    } catch (error) {
      if (error.code === '23505' && error.constraint === 'UQ_user_email') {
        //dublicate email
        throw new ConflictException('Email alredy used');
      } else if (
        error.code === '23505' &&
        error.constraint === 'UQ_user_username'
      ) {
        throw new ConflictException('Username alredy used');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async deleteAccount(reqUserId: User, deleteUserId: User): Promise<String> {
    if (reqUserId === deleteUserId) {
      throw new NotAcceptableException("You can't delete own account");
    }

    const user = await this.users.delete(deleteUserId);

    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    return 'User Deleted Successfully';
  }
}
