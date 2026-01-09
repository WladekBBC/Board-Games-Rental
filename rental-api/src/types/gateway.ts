import { Game } from "src/game/entities/game.entity";
import { Rental } from "src/rental/entities/rental.entity";

export interface RentalEvents{
  rentalCreated: (rental: Rental) => void
  rentalStatusChanged: (rental: Rental) => void
  rentalDeleted: (id: number) => void
}

export interface GamesEvents{
  gameQuantityChange: (game: Game) => void
}