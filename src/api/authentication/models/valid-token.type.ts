import { User } from './user.type';

/**
 * Response for valid token validation.
 * @description To be cached with user information until expiration date.
 */
export type ValidToken = {
  user: User;
  token: string;
  expiresAt: Date;
};

// ? how the user is populated?
