import { Body, Controller, Post } from '@nestjs/common';
import { CreateAccountInput } from './dto/create-account.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  signUp(@Body() createAccountInput: CreateAccountInput) {
    console.log(createAccountInput);
  }
}
