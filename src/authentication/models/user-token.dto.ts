import { UserDto } from "./user.dto";

export class UserTokenDto {
    user: UserDto;
    token: string;
}
