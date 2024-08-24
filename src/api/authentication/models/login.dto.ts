import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

/**
 * Login DTO
 * @description Requires email and password
 */
export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
