import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from './../auth/decorators/role.decorator';
import { CreateAccountInput } from './dto/create-account.dto';
import { LoginInput } from './dto/login.dto';
import { SetUserRole } from './dto/set-user.role.dto';
import { UpdateAccountInput } from './dto/update-account.dto';
import { User } from './entites/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  signUp(
    @Body() createAccountInput: CreateAccountInput,
  ): Promise<{ accessToken: string }> {
    return this.userService.signUp(createAccountInput);
  }

  @Post('/signin')
  signIn(@Body() loginInput: LoginInput): Promise<{ accessToken: string }> {
    return this.userService.signIn(loginInput);
  }

  @Patch()
  @UseGuards(AuthGuard())
  updateAccount(
    @GetUser('id') userId: User,
    @Body() updateAccountInput: UpdateAccountInput,
  ): Promise<User> {
    return this.userService.updateAccount(updateAccountInput, userId);
  }

  // this method only Admin and Superviser
  @Delete('/:id')
  @Role(['Admin', 'Supervisor'])
  @UseGuards(AuthGuard(), RolesGuard)
  deleteAccount(
    @GetUser('id') userId: User,
    @Param('id', ParseIntPipe) id: User,
  ): Promise<String> {
    return this.userService.deleteAccount(userId, id);
  }

  @Patch('/role')
  @Role(['Admin', 'Supervisor'])
  @UseGuards(AuthGuard(), RolesGuard)
  setUserRole(
    @GetUser('id') userId: number,
    @Body() setUserRole: SetUserRole,
  ): Promise<User> {
    return this.userService.setUserRole(userId, setUserRole);
  }

  @Get('/users')
  @Role(['Admin', 'Supervisor'])
  @UseGuards(AuthGuard(), RolesGuard)
  getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }
}
