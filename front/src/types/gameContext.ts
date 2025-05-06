import { IGame } from "@/interfaces/game"

export type GamesContextType = {
    games: IGame[]
    loading: boolean
    addGame: (game: Partial<IGame>) => void
    updateGame: (id: number, updates: Partial<IGame>) => Promise<void>
    updateGameAvailability: (id: number, rentedQuantity: number) => void
    deleteGame: (id: number) => void
}