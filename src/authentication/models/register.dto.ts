import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MinLength,
    IsEnum,
  } from "class-validator";
import { Role } from "./role.type";
  
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
    @IsEnum(["traveler", "agency", "financial", "it"])
    role: Role;
  }
