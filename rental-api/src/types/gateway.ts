import { Game } from "src/game/entities/game.entity";
import { Rental } from "src/rental/entities/rental.entity";

export interface RentalEvents {
  rentalCreated: (rental: Rental) => void;
  rentalStatusChanged: (rental: Rental) => void;
  rentalDeleted: (id: number) => void;
  queueJoined: (data: { position: number; gameId: number }) => void;
  queueUpdated: (data: { position: number; gameId: number }) => void;
  autoRented: (rental: Rental) => void;
}

export interface GamesEvents {
  gameQuantityChange: (game: Game) => void;
}
