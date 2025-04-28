export class CreateUserDto{
    readonly email: string;
    readonly password: string;
    readonly permissions: PermsDto;
}

export class UpdateUserDto{
    readonly email: string;
    readonly password: string;
    readonly permissions: PermsDto;
}

export class UserDto{
    readonly email: string;
    readonly permissions: PermsDto;
}

export enum PermsDto{
    A = "Admin",
    R = "RWSS", 
    U = "User"
}