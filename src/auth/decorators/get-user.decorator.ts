/* eslint-disable prettier/prettier */
import { createParamDecorator } from '@nestjs/common';
import { User } from 'src/user/entites/user.entity';

export const GetUser = createParamDecorator((data, req): User => {
  const request = req.switchToHttp().getRequest();

  if (!request.user) {
    return null;
  }

  if (data) {
    return request.user[data];
  }

  return request.user;
});
