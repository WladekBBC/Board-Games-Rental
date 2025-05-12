import { Perms } from "src/enums/permissions.enum";

export class LoginDto{
    readonly email: string;
    readonly password: string;
}

export class RegisterDto{
    readonly email: string;
    readonly password: string;
}

export class LoggedUserDto{
    readonly token: string;
    readonly permissions: Perms;
}