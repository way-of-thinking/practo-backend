import {
  Body,
  Controller,
  Delete,
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

  @Delete()
  @Role(['Admin', 'Supervisor'])
  @UseGuards(AuthGuard(), RolesGuard)
  deleteAccount(@Param('id', ParseIntPipe) id: User) {
    return this.userService.deleteAccount(id);
  }
}
