import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    HttpCode,
    HttpStatus,
    Headers, // Dodano Headers
  } from '@nestjs/common';
  import { GamesService } from './games.service';
  import { CreateGameDto } from './dto/create-game.dto';
  import { UpdateGameDto } from './dto/update-game.dto';
  import { AuthGuard } from '../guards/auth.guard'; 
  import { Permission } from '../decorators/permissions.decorator'; 
  import { Perms } from '../enums/permissions.enum'; 
  
  @Controller('games')
  export class GamesController {
    constructor(private readonly gamesService: GamesService) {}
  
    /**
     * Creates a new game.
     * Requires Admin permission.
     * @param createGameDto - Data for the new game.
     * @param headers - Request headers potentially containing auth info.
     * @returns The created game object.
     */
    @Post()
    @UseGuards(AuthGuard)
    @Permission([Perms.A]) 
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createGameDto: CreateGameDto, @Headers() headers: Record<string, string>) {
      return this.gamesService.create(createGameDto);
    }
  
    /**
     * Gets a list of all games.
     * Requires Admin or Reader permission.
     * @returns A list of games.
     */
    @Get() 
    @UseGuards(AuthGuard)
    @Permission([Perms.A]) 
    @HttpCode(HttpStatus.OK)
    findAll() {
      return this.gamesService.findAll();
    }
  
    /**
     * Gets a specific game by ID.
     * Requires Admin or Reader permission.
     * @param id - The ID of the game to retrieve.
     * @returns The found game object.
     */
    @Get(':id')
    @UseGuards(AuthGuard)
    @Permission([Perms.A]) 
    @HttpCode(HttpStatus.OK)
    findOne(@Param('id') id: string) {
      return this.gamesService.findOne(+id);
    }
  
    /**
     * Updates an existing game.
     * Requires Admin permission.
     * @param id - The ID of the game to update.
     * @param updateGameDto - The data to update the game with.
     * @param headers - Request headers containing auth info (permissions, token).
     * @returns The updated game object or confirmation.
     */
    @Patch(':id')
    @UseGuards(AuthGuard)
    @Permission([Perms.A]) 
    @HttpCode(HttpStatus.OK)
    update(
      @Param('id') id: string,
      @Body() updateGameDto: UpdateGameDto,
      @Headers() headers: Record<string, string>,) {return this.gamesService.update(+id, updateGameDto);}
  
    /**
     * Deletes a game.
     * Requires Admin permission.
     * @param id - The ID of the game to delete.
     * @param headers - Request headers containing auth info (permissions, token).
     * @returns Confirmation of deletion.
     */
    @Delete(':id')
    @UseGuards(AuthGuard)
    @Permission([Perms.A]) 
    @HttpCode(HttpStatus.OK) 
    remove(
      @Param('id') id: string,
      @Headers() headers: Record<string, string>, 
    ) {return this.gamesService.remove(+id);}
  }