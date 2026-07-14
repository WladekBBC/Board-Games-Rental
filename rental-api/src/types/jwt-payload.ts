import { Perms } from "src/enums/permissions.enum";

export interface JwtPayload {
  id: number;
  email: string;
  permissions: Perms;
  iat?: number;
  exp?: number;
}
