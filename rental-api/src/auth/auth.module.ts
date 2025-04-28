import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './contstants';
import { UserModule } from 'src/user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { PermsGuard } from 'src/guards/perms.guard';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: `${60*60*12}s` },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, {provide: APP_GUARD, useClass: PermsGuard,}],
})
export class AuthModule {}
