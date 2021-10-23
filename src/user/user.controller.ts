import { Body, Controller, Delete, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { Role } from './../auth/decorators/role.decorator';
import { CreateAccountInput } from './dto/create-account.dto';
import { LoginInput } from './dto/login.dto';
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
  ) {
    return this.userService.updateAccount(updateAccountInput, userId);
  }

  @Delete()
  @UseGuards(AuthGuard())
  @Role(['Admin'])
  deleteAccount(
    @GetUser('id') userId: User,
    @Body() updateAccountInput: UpdateAccountInput,
  ) {
    return this.userService.updateAccount(updateAccountInput, userId);
  }
}
