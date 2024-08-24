import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../api/authentication/models/user.type';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Generates a JWT token for the given user.
   * @param user - The user to generate the token for.
   * @returns The generated JWT token.
   */
  public generateToken(user: User): string {
    return this.jwtService.sign({ sub: user.id, user });
  }

  /**
   * Validates a JWT token and returns the decoded user information.
   * @param token - The JWT token to validate.
   * @returns The decoded user information.
   */
  public validateToken(token: string): User {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  /**
   * Gets the expiration date of a JWT token.
   * @param token - The JWT token to get the expiration date for.
   * @returns The expiration date of the token.
   */
  public getExpirationDate(token: string): Date {
    const decoded = this.jwtService.decode(token) as { exp: number };
    return new Date(decoded.exp * 1000);
  }
}
