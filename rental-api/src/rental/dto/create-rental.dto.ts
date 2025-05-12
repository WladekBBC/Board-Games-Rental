import { Game } from "src/game/entities/game.entity";

export class CreateRentalDto {
    index: string;
    rentedAt: Date;
    game: Game;
}
