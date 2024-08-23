import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from 'src/authentication/models/user.dto';

/**
 * Token service is used to generate and verify JWT tokens.
 * @requires JwtService from @nestjs/jwt
 */
@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Generate a JWT token for a user.
   * @param {UserDto} user - The user DTO object.
   * @returns {string} - The JWT token.
   */
  generateToken(user: UserDto): string {
    const payload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }
}
