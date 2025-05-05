import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { GameModule } from './game/game.module';
import { RentalModule } from './rental/rental.module';
import { Game } from './game/entities/game.entity';
import { Rental } from './rental/entities/rental.entity';
import { APP_GUARD } from '@nestjs/core';
import { PermsGuard } from './guards/perms.guard';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type:'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: "rental",
      entities: [User, Game, Rental],
      synchronize: true
    }),
    UserModule,
    AuthModule,
    GameModule,
    RentalModule],
  controllers: [AppController],
  providers: [AppService, {provide: APP_GUARD, useClass: PermsGuard}],
})

export class AppModule{};
