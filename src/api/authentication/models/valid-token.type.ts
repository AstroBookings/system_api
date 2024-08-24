import { User } from './user.type';

/**
 * Valid token type
 * @description Represents a valid token with user information, token, and expiration date.
 */
export type ValidToken = {
  user: User;
  token: string;
  expiresAt: Date;
};
