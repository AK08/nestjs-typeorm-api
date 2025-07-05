import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../entity/user.entity';

export const ROLES_KEY = 'roles';
// eg. SetMetadata('roles', ['admin', 'moderator'])
// ...roles - Collects all role arguments from guard into an array
// : UserRole[] - Ensures only valid roles can be passed (type safety)
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
