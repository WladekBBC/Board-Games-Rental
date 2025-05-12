import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Sse } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Permission } from 'src/decorators/permissions.decorator';
import { Perms } from 'src/enums/permissions.enum';
import { AuthGuard } from 'src/guards/auth.guard';
import { Game } from './entities/game.entity';
import { from, map, Observable } from 'rxjs';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @UseGuards(AuthGuard)
  @Permission([Perms.A])
  @Post("/add")
  create(@Body() createGameDto: CreateGameDto) {
    return this.gameService.create(createGameDto);
  }

  @Sse('/stream-games')
  subscribeGames(): Observable<{data: Game[]}> {
    return from(this.gameService.findAll()).pipe(map((games)=>({ data: games })))
  }


  @Get("/games")
  findAll() {
    return this.gameService.findAll();
  }

  @UseGuards(AuthGuard)
  @Permission([Perms.R, Perms.A])
  @Patch('/update/:id')
  update(@Param('id') id: number, @Body() updateGameDto: UpdateGameDto) {
    return this.gameService.update(id, updateGameDto);
  }

  @UseGuards(AuthGuard)
  @Permission([Perms.R, Perms.A])
  @Delete('/delete/:id')
  remove(@Param('id') id: number) {
    return this.gameService.remove(id);
  }
}
