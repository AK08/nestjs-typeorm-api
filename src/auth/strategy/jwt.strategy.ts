import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

/* 
this registers a passport strategy, and nestjs and passport gives
it the name 'jwt' by default.
there are 3 important classes involed here. 
1. Strategy from passport-jwt - knows how to extract jwt, verify signature
  call validate function
2. PassportStrategy - wrapper class - wraps Strategy, Integrates Strategy
  into nest's DI system, makes strategy calss work with @UseGuard()
3. JwtStrategy - our class. when we call super, it calls const of PassportStrategy
  , which calls constructor of strategy.  
*/
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    const JwtSecret = configService.get<string>('JWT_SECRET');
    if (!JwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JwtSecret,
    });
  }

  // validate(payload) is auto called by the passport after decoding the jwt. We dont call it manually.
  // whatever I return from validate method becomes the request.user
  async validate(payload: any) {
    const user = await this.authService.getUserById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Invalid User.');
    }
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };
  }
}
