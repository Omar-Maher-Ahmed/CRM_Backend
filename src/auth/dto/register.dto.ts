import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  fullName: string;

  @IsEmail()
  email: string;

  @Matches(/^\+?[0-9]{10,15}$/)
  phone: string;

  @MinLength(8)
  @MaxLength(64)
  password: string;
}