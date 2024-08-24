import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from './role.type';

/**
 * Register DTO
 * @description Requires name, email, password, and role
 */
export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsEnum(['traveler', 'agency', 'financial', 'it'])
  role: Role;
}
