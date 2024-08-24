import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from 'src/api/authentication/models/user-token-payload.type';
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
    return this.jwtService.sign({ sub: user.id });
  }

  /**
   * Validates a JWT token and returns the decoded user information.
   * @param token - The JWT token to validate.
   * @returns The decoded payload information.
   */
  public validateToken(token: string): TokenPayload {
    try {
      const decoded = this.jwtService.verify(token);
      return decoded;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
