
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { config } from './.env';
import { SMTPModule } from './smtp/smtp.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env'
    }),
    TypeOrmModule.forRoot({
      type:'mysql',
      host: config.DB_HOST,
      port: 3306,
      username: config.DB_USER,
      password: config.DB_PASS,
      database: config.DB_NAME,
      entities: [User, Game, Rental],
      synchronize: true,
      autoLoadEntities: true,
    }),
    UserModule,
    AuthModule,
    GameModule,
    RentalModule,
    SMTPModule],
  controllers: [AppController],
  providers: [AppService, {provide: APP_GUARD, useClass: PermsGuard}],
})

export class AppModule{};
