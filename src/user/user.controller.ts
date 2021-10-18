import { Body, Controller, Post } from '@nestjs/common';
import { CreateAccountInput } from './dto/create-account.dto';
import { LoginInput } from './dto/login.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  signUp(@Body() createAccountInput: CreateAccountInput) {
    return this.userService.signUp(createAccountInput);
  }

  @Post('/signin')
  signIn(@Body() loginInput: LoginInput) {
    return this.userService.signIn(loginInput);
  }
}
