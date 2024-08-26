import { User } from './user.type';

/**
 * User Token DTO for login, register, and validation responses
 * @description DTO for returning a user, their token, and expiration time
 */
export type UserToken = {
  user: User;
  token: string;
  exp: number;
};

/**
 * Token payload for JWT
 */
export type TokenPayload = {
  sub: string;
  iat: number;
  exp: number;
};
