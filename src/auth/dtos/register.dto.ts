import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Please provide a valid Email' })
  email: string;

  @IsString({ message: 'Name Should be string only' })
  @IsNotEmpty({ message: 'Name Cannot be empty' })
  @MaxLength(30, { message: 'Name maximun length is 30 characters.' })
  name: string;

  @IsNotEmpty({ message: 'Cannot be empty' })
  @MinLength(6, { message: 'Password Minimun length is 6 characters.' })
  password: string;
}
