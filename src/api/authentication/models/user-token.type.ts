import { User } from './user.type';

/**
 * User Token DTO
 * @description DTO for returning a user and their token
 */
export type UserToken = {
  user: User;
  token: string;
};
