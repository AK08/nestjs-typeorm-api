import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MinLength(3, { message: 'title should have more length' })
  @MaxLength(30, { message: 'title should be shorter' })
  title: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MinLength(3, { message: 'content should have more length' })
  content: string;
}
