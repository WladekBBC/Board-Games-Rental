import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "src/user/user.module";
import { appEnv } from "src/config/env";

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: appEnv.jwtSecret,
      signOptions: { expiresIn: appEnv.jwtExpiresIn },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
