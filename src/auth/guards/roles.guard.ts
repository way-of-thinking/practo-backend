import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from 'src/user/entites/user.entity';
import { AuthService } from '../auth.service';
import { AllowedRoles } from '../decorators/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<AllowedRoles>(
      'roles',
      context.getHandler(),
    );
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    if (!user) {
      return false;
    }
    if (roles.includes('Any')) {
      return true;
    }
    return roles.includes(user.role);

    //   map((user: User) => {
    //     const hasRole = () => roles.indexOf(user.role) > -1;
    //     let hasPermission: boolean = false;

    //     if (hasRole()) {
    //       hasPermission = true;
    //     }
    //     return user && hasPermission;
    //   }),
  }
}
