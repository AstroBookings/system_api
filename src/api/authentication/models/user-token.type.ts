import { User } from './user.type';

/**
 * User Token DTO for login and register responses
 * @description DTO for returning a user and their token
 */
export type UserToken = {
  user: User;
  token: string;
};
