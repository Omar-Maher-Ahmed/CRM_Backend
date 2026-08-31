import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  @Matches(/^[a-zA-Z0-9@.\-_]+$/, { message: 'Email contains invalid characters' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MaxLength(50, { message: 'Password is too long' })
  @Matches(/^[a-zA-Z0-9!@#$%^&*()_+.\-]+$/, { message: 'Password contains invalid characters' })
  password: string;
}
