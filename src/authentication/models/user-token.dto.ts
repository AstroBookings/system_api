import { UserDto } from './user.dto';

/**
 * User Token DTO
 * @description DTO for returning a user and their token
 */
export class UserTokenDto {
  user: UserDto;
  token: string;
}
