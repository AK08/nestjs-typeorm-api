import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Please provide a valid Email' })
  email: string;

  @IsNotEmpty({ message: 'Cannot be empty' })
  @MinLength(6, { message: 'Password Minimun length is 6 characters.' })
  password: string;
}
