import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './guards/JwtAuthGuard';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({}),
    PassportModule,
  ],
  controllers: [AuthController],
  /*
  add to the providers, classes that use Injectable and have constructors so that nestjs can instantiate it with DI. Even if
  no constructor add it here for best practices.
  */
  providers: [AuthService, JwtAuthGuard, JwtStrategy, RolesGuard],
})
export class AuthModule {}
