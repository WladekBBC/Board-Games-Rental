import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";
import { Perms } from "src/enums/permissions.enum";

export class CreateUserDto {
  @IsEmail()
  readonly email!: string;

  @IsString()
  @MinLength(6)
  readonly password!: string;

  @IsOptional()
  @IsEnum(Perms)
  readonly permissions?: Perms;
}

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsEnum(Perms)
  permissions?: Perms;
}

export class UserDto {
  readonly email!: string;
  readonly permissions!: Perms;
}
