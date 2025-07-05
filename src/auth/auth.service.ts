import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entity/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // Private methods
  private async hashPassword(password: string) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  private async verifyPassword(plain: string, hash: string) {
    return await bcrypt.compare(plain, hash);
  }

  private async generateToken(user: User) {
    return {
      accessToken: await this.generateAccessToken(user),
      refreshToken: await this.generateRefreshToken(user),
    };
  }

  private async generateAccessToken(user: User) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '15m',
    });
    return accessToken;
  }

  private async generateRefreshToken(user: User) {
    const payload = {
      sub: user.id,
    };
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });
    return refreshToken;
  }

  // Services
  async register(registerDto: RegisterDto) {
    const existingEmail = await this.usersRepository.findOne({
      where: { email: registerDto.email },
    });
    if (existingEmail) {
      throw new ConflictException('Email already exist');
    }

    const hashedPassword = await this.hashPassword(registerDto.password);
    const newUser = this.usersRepository.create({
      email: registerDto.email,
      name: registerDto.name,
      password: hashedPassword,
      role: UserRole.USER,
    });

    const saveUser = await this.usersRepository.save(newUser);

    const { password, ...result } = saveUser;
    return {
      user: result,
      message: 'Registeration completed',
    };
  }

  async registerAdmin(registerDto: RegisterDto) {
    const existingEmail = await this.usersRepository.findOne({
      where: { email: registerDto.email },
    });
    if (existingEmail) {
      throw new ConflictException('Email already exist');
    }

    const hashedPassword = await this.hashPassword(registerDto.password);
    const newUser = this.usersRepository.create({
      email: registerDto.email,
      name: registerDto.name,
      password: hashedPassword,
      role: UserRole.ADMIN,
    });

    const saveUser = await this.usersRepository.save(newUser);

    const { password, ...result } = saveUser;
    return {
      user: result,
      message: 'Registeration for admin completed',
    };
  }

  async login(loginDto: LoginDto) {
    const User = await this.usersRepository.findOne({
      where: { email: loginDto.email },
    });

    if (
      !User ||
      !(await this.verifyPassword(loginDto.password, User.password))
    ) {
      throw new UnauthorizedException(
        'Invalid credentails or account does not exist.',
      );
    }

    const tokens = await this.generateToken(User);
    const { password, ...result } = User;
    return {
      User: result,
      ...tokens,
    };
  }

  async refreshToken(refreshToken): Promise<{ accessToken: string }> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.usersRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid Token1');
      }

      const accessToken = await this.generateAccessToken(user);

      return {
        accessToken: accessToken,
      };
    } catch {
      throw new UnauthorizedException('Invalid Token2');
    }
  }

  async getUserById(userId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { password, ...result } = user;
    return result;
  }

  async getAllUsers() {
    const users = await this.usersRepository.find({
      relations: ['posts'],
    });

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      posts: user.posts.map((post) => ({
        id: post.id,
        title: post.title,
        content: post.content,
      })),
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }

  async deleteUserById(userId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    // note : both remove and delete methods will work for onDelete: 'CASCADE', as it is a database level feature and not a typeorm feature.
    await this.usersRepository.remove(user);
    return { message: 'User deleted successfully' };
  }
}
