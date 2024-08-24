import { Role } from './role.type';

/**
 * User DTO
 * @description DTO for returning a user
 */
export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};
