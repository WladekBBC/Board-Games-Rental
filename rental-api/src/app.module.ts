import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { UserService } from './user/user.service';
import { GamesModule } from './games/games.module';
import { Game } from './games/entities/game.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type:'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: "rental",
      entities: [User, Game],
      synchronize: true
    }),
    UserModule,
    AuthModule,
    GamesModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule{};
