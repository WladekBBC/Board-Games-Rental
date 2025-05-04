import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'; // Dodano wyjątki
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from './entities/game.entity';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
// Możesz potrzebować zaimportować enum Perms, jeśli będziesz go tu używać
// import { Perms } from '../enums/permissions.enum';
// Możesz potrzebować typu User, jeśli guard dodaje req.user
// import { User } from '../user/entities/user.entity';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game)
    private gamesRepository: Repository<Game>,
  ) {}

  /**
   * Creates a new game.
   * @param createGameDto - Data for the new game.
   * @returns The created game entity.
   */
  async create(createGameDto: CreateGameDto): Promise<Game> {
    console.log('Creating game with data:', createGameDto);
    try {
      const game = this.gamesRepository.create(createGameDto);
      const savedGame = await this.gamesRepository.save(game);
      console.log('Game created successfully:', savedGame);
      return savedGame;
    } catch (error) {
      console.error('Error creating game:', error);
      throw error;
    }
  }

  /**
   * Finds all games.
   * @returns An array of game entities.
   */
  async findAll(): Promise<Game[]> {
    return this.gamesRepository.find();
  }

  /**
   * Finds a single game by its ID.
   * Throws NotFoundException if the game doesn't exist.
   * @param id - The ID of the game to find.
   * @returns The found game entity.
   */
  async findOne(id: number): Promise<Game> {
    const game = await this.gamesRepository.findOne({ where: { id } });
    if (!game) {
      // Rzucamy wyjątek, jeśli gra nie została znaleziona
      throw new NotFoundException(`Game with ID ${id} not found`);
    }
    return game;
  }

  /**
   * Updates an existing game.
   * Throws NotFoundException if the game doesn't exist.
   * Optionally checks permissions before updating.
   * @param id - The ID of the game to update.
   * @param updateGameDto - The data to update the game with.
   * @param userPermissions - (Optional) Permissions of the requesting user for authorization checks.
   * @param requestingUserId - (Optional) ID of the requesting user for ownership checks.
   * @returns The updated game entity.
   */
  async update(
    id: number,
    updateGameDto: UpdateGameDto,
    userPermissions?: string[], // Opcjonalny parametr na uprawnienia
    requestingUserId?: number, // Opcjonalny parametr na ID użytkownika
  ): Promise<Game> {
    // Najpierw znajdujemy encję - findOne rzuci NotFoundException jeśli nie istnieje
    const game = await this.findOne(id);

    // --- Miejsce na logikę autoryzacji ---
    // Przykład: Tylko admin może edytować LUB twórca gry (jeśli encja Game ma pole creatorId)
    // const isAdmin = userPermissions?.includes(Perms.A);
    // const isOwner = game.creatorId === requestingUserId; // Zakładając, że Game ma pole creatorId
    // if (!isAdmin /* && !isOwner */ ) { // Odkomentuj/dostosuj warunek właściciela
    //   throw new ForbiddenException('You do not have permission to update this game.');
    // }
    // --- Koniec logiki autoryzacji ---

    // Łączymy zmiany z DTO z istniejącą encją
    // Object.assign dba o to, by zaktualizować tylko przekazane pola
    Object.assign(game, updateGameDto);

    // Zapisujemy zaktualizowaną encję
    return this.gamesRepository.save(game);
  }

  /**
   * Removes a game by its ID.
   * Throws NotFoundException if the game doesn't exist.
   * Optionally checks permissions before removing.
   * @param id - The ID of the game to remove.
   * @param userPermissions - (Optional) Permissions of the requesting user for authorization checks.
   * @param requestingUserId - (Optional) ID of the requesting user for ownership checks.
   * @returns Promise resolving when deletion is complete.
   */
  async remove(
    id: number,
    userPermissions?: string[], // Opcjonalny parametr na uprawnienia
    requestingUserId?: number, // Opcjonalny parametr na ID użytkownika
  ): Promise<void> {
    const game = await this.findOne(id); 
    // --- Miejsce na logikę autoryzacji ---
    // Przykład: Tylko admin może usuwać LUB twórca gry
    // const isAdmin = userPermissions?.includes(Perms.A);
    // const isOwner = game.creatorId === requestingUserId; // Zakładając, że Game ma pole creatorId
    // if (!isAdmin /* && !isOwner */) { // Odkomentuj/dostosuj warunek właściciela
    //   throw new ForbiddenException('You do not have permission to delete this game.');
    // }
    // --- Koniec logiki autoryzacji ---

    // Usuwamy encję na podstawie ID
    const deleteResult = await this.gamesRepository.delete(id);

    // Dodatkowe sprawdzenie (choć findOne powinno już to wyłapać)
    if (deleteResult.affected === 0) {
      throw new NotFoundException(`Game with ID ${id} not found during delete operation.`);
    }
    
  }
}