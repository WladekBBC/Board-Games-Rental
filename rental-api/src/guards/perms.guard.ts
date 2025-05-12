import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PERMS_KEY } from "src/decorators/permissions.decorator";
import { Perms } from "src/enums/permissions.enum";

@Injectable()
export class PermsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPerms = this.reflector.getAllAndOverride<Perms[]>(PERMS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPerms) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    return requiredPerms.some((perm) => request.headers.permissions?.includes(perm));
  }
}