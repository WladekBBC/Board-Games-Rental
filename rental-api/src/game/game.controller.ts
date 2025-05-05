import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Permission } from 'src/decorators/permissions.decorator';
import { Perms } from 'src/enums/permissions.enum';
import { AuthGuard } from 'src/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}
  
  @Permission([Perms.A])
  @Post("/add")
  create(@Body() createGameDto: CreateGameDto) {
    return this.gameService.create(createGameDto);
  }

  @Permission([Perms.R, Perms.A])
  @Get("/games")
  findAll() {
    return this.gameService.findAll();
  }

  @Permission([Perms.R, Perms.A])
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.gameService.findOne(id);
  }

  @Permission([Perms.R, Perms.A])
  @Patch('/update/:id')
  update(@Param('id') id: number, @Body() updateGameDto: UpdateGameDto) {
    return this.gameService.update(id, updateGameDto);
  }

  @Permission([Perms.R, Perms.A])
  @Delete('/delete/:id')
  remove(@Param('id') id: number) {
    return this.gameService.remove(id);
  }
}
