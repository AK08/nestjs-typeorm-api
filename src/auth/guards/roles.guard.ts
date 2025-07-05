import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../entity/user.entity';
import { ROLES_KEY } from '../decorators/roles.decorator';

// canActivate is built in interface from @nestjs/common, if canActivate returns true, the
// request proceeds else nestjs blocks the request. when a class implements CanActivate,
// it becomes a guard.
@Injectable()
export class RolesGuard implements CanActivate {
  // Reflect is a helper class that helps to access the metadata of routes
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // read the required roles from metadata of route handler
    // getHandler and getClass gives the acess to method and class respectively to get role. because
    // we can define metadata at method and class level.
    // getAllAndOverride - looks for metadate (ROLES-KEY) on the method then controller.
    // returns the first match . UserRole[] expected return type
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    // Extract user from the request. This is from JWT strategy and request.user
    const { user } = context.switchToHttp().getRequest();
    // requiredRoles has the list of roles that can access the route like admin, super-admin etc,
    // we are check if any one match is found with user.role.
    // documentation use requiredRoles.some((role) => user.roles?.includes(role)) (notice its user.roles , note user.role); because its for a case where our user.role is an array with
    // many permission and maybe atleast one role matches the requiredRole . eg user.role = ['admin', 'moderator'], requiredRole = ['moderator', 'lab-admin']
    const hasRequiredRoles = requiredRoles.some((role) => user.role === role);
    if (!hasRequiredRoles) {
      throw new UnauthorizedException('Insufficient permission');
    }
    return true;
  }
}
