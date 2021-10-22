/* eslint-disable prettier/prettier */
import { createParamDecorator } from '@nestjs/common';
import { User } from 'src/user/entites/user.entity';

export const GetUser = createParamDecorator((data, req): User => {
  const request = req.switchToHttp().getRequest();
  return request.user;
});
