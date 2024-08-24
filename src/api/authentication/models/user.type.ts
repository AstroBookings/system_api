import { Role } from './role.type';

/**
 * User data type
 * @description Data type for a user
 */
export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};
