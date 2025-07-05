import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { JwtAuthGuard } from './guards/JwtAuthGuard';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from './entity/user.entity';
import { RolesGuard } from './guards/roles.guard';
import { CurrentUser } from './decorators/currentuser.decorator';
import { LoginThrottlerGuard } from './guards/login-throller.guard';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  // custom throttle limit, overriding the app module settings. ttl - time to live (in milliseconds)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @UseGuards(LoginThrottlerGuard)
  @Post('login')
  post(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('create-admin')
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  registerAdmin(@Body() registerDto: RegisterDto) {
    return this.authService.registerAdmin(registerDto);
  }

  @Post('refresh')
  refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@CurrentUser() user: any) {
    return user;
  }

  // to get all the users from the database
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('users')
  getAllUsers() {
    return this.authService.getAllUsers();
  }

  // since we have used  onDelete: 'CASCADE', in post entity, deleting a user will delete all his posts.
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  deleteUserById(@Param('id', ParseIntPipe) id: number) {
    return this.authService.deleteUserById(id);
  }
}
