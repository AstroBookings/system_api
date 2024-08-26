import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from '../models/user-token.type';

@Injectable()
export class TokenService {
  readonly #logger = new Logger(TokenService.name);

  constructor(private readonly jwtService: JwtService) {}

  /**
   * Generates a JWT token for the given user.
   * @param sub - The subject of the token.
   * @returns The generated JWT token.
   */
  public generateToken(sub: string): string {
    const token = this.jwtService.sign({ sub });
    return token;
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
      this.#logger.log('👽 Invalid token', token);
      throw new UnauthorizedException(error);
    }
  }

  /**
   * Decodes a JWT token.
   * @param token - The token to decode.
   * @returns The decoded token payload.
   */
  public decodeToken(token: string): TokenPayload {
    try {
      return this.jwtService.decode(token) as TokenPayload;
    } catch (error) {
      this.#logger.log('👽 Invalid token', token);
      throw new UnauthorizedException(error);
    }
  }
}
