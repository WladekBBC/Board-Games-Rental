import { BadRequestException, Injectable } from "@nestjs/common";
import { Rental } from "./entities/rental.entity";
import { QueueEntry } from "./entities/queue-entry.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Game } from "src/game/entities/game.entity";
import { User } from "src/user/entities/user.entity";

@Injectable()
export class RentalService {
  constructor(
    @InjectRepository(Rental)
    private readonly rentalRepo: Repository<Rental>,

    @InjectRepository(QueueEntry)
    private readonly queueRepo: Repository<QueueEntry>,

    @InjectRepository(Game)
    private readonly gameRepo: Repository<Game>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  findAll() {
    return this.rentalRepo.find();
  }

  async findByGame(gameId: number) {
    const game = await this.gameRepo.findOneBy({ id: gameId });
    if (game) return this.rentalRepo.findBy({ game: game });
    throw new BadRequestException();
  }

  findOne(id: number) {
    return this.rentalRepo.findOneBy({ id });
  }

  // Queue methods
  async addToQueue(userId: number, gameId: number): Promise<number> {
    const user = await this.userRepo.findOneBy({ id: userId });
    const game = await this.gameRepo.findOneBy({ id: gameId });

    if (!user || !game) {
      throw new BadRequestException("User or game not found");
    }

    // Check if user is already in queue for this game
    const existing = await this.queueRepo.findOneBy({ user: { id: userId }, game: { id: gameId } });
    if (existing) {
      throw new BadRequestException("User already in queue for this game");
    }

    const queueEntry = this.queueRepo.create({ user, game });
    await this.queueRepo.save(queueEntry);

    // Return position in queue (1-based)
    const position = await this.getQueuePosition(userId, gameId);
    return position;
  }

  async getNextInQueue(gameId: number): Promise<QueueEntry | null> {
    return this.queueRepo.findOne({
      where: { game: { id: gameId } },
      order: { createdAt: "ASC" },
      relations: ["user", "game"],
    });
  }

  async removeFromQueue(queueEntryId: number): Promise<void> {
    await this.queueRepo.delete({ id: queueEntryId });
  }

  async getQueuePosition(userId: number, gameId: number): Promise<number> {
    // Count how many entries are before this user in the queue
    const entries = await this.queueRepo.find({
      where: { game: { id: gameId } },
      order: { createdAt: "ASC" },
    });

    const index = entries.findIndex(e => e.user.id === userId);
    return index >= 0 ? index + 1 : 0;
  }

  async getQueueForGame(gameId: number): Promise<QueueEntry[]> {
    return this.queueRepo.find({
      where: { game: { id: gameId } },
      order: { createdAt: "ASC" },
      relations: ["user", "game"],
    });
  }

  async removeUserFromQueue(userId: number, gameId: number): Promise<void> {
    await this.queueRepo.delete({ user: { id: userId }, game: { id: gameId } });
  }
}
