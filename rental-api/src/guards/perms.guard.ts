import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { appEnv } from "src/config/env";
import { PERMS_KEY } from "src/decorators/permissions.decorator";
import { Perms } from "src/enums/permissions.enum";
import { JwtPayload } from "src/types/jwt-payload";

@Injectable()
export class PermsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPerms = this.reflector.getAllAndOverride<Perms[]>(PERMS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPerms) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers.authorization;

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: appEnv.jwtSecret,
      });
      request.user = payload;

      if (!requiredPerms.includes(payload.permissions)) {
        throw new ForbiddenException();
      }
    } catch (error) {
      if (
        error instanceof ForbiddenException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new UnauthorizedException();
    }

    return true;
  }
}
