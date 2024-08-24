import { User } from './user.type';
export type TokenPayload = {
  sub: string;
  iat: number;
  exp: number;
};
/**
 * Response for token validation.
 * @description To be cached with user information until expiration date.
 */
export type UserTokenPayload = {
  user: User;
  tokenPayload: TokenPayload;
};
