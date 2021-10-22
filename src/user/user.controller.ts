import { Body, Controller, Patch, Post } from '@nestjs/common';
import { GetUser } from 'src/auth/get-user.decorator';
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
  updateAccount(
    @Body() updateAccountInput: UpdateAccountInput,
    @GetUser() user: User,
  ) {
    return this.userService.signIn;
  }
}
