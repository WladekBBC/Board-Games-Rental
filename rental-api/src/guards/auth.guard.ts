import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    const token = ""+request.headers.authorization;

    if (!token) {
      throw new UnauthorizedException;
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {secret: `${process.env.JWT_SEC}`});
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

}