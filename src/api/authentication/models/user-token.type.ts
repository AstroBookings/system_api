import { User } from './user.type';

/**
 * User Token DTO
 * @description DTO for returning a user and their token
 */
export type UserToken = {
  user: User; // ? should we remove the user?
  token: string;
};

// ? : could be simplified to just the token and the user id?
