import { Body, Controller, Patch, Post } from '@nestjs/common';
import { CreateAccountInput } from './dto/create-account.dto';
import { LoginInput } from './dto/login.dto';
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

  @Patch('/:id/status')
  updateTaskStatus(
    @Body() status: TaskStatus,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.updateTaskStatus(taskId, status, user);
  }
}
