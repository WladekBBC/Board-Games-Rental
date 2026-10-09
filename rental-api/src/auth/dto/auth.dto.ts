import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginDto {
  @IsEmail()
  readonly email!: string;

  @IsString()
  @MinLength(6)
  readonly password!: string;
}

export class RegisterDto {
  @IsEmail()
  readonly email!: string;

  @IsString()
  @MinLength(6)
  readonly password!: string;
}

export class LoggedUserDto {
  readonly token!: string;
}
