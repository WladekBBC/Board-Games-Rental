
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRoot({
      type:'mysql',
      host: process.env.DB_HOST,
      port: parseInt(`${process.env.DB_PORT}`),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [User, Game, Rental],
      synchronize: true,
      autoLoadEntities: true,
  }),
    UserModule,
    AuthModule,
    GameModule,
    RentalModule],
  controllers: [],
  providers: [{provide: APP_GUARD, useClass: PermsGuard}],
})

export class AppModule{};
