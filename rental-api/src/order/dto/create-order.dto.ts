import { Game } from "src/game/entities/game.entity";
import { User } from "src/user/entities/user.entity";

export class CreateOrderDto {
    createdAt: Date;
    user: User;
    game: Game;
}
