import { Role } from "./role.type";

export class UserDto {
    id: string;
    name: string;
    email: string;
    role: Role;
}
