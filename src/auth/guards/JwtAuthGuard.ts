import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// use the passport strategy registered under the name 'jwt'
// to guard this route.
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
