import { IGame } from "@/interfaces/game"


export type SearchType = 'title' | 'category';

export type GamesContextType = {
    games: IGame[]
    loading: boolean
    addGame: (game: Omit<IGame, 'id'>) => Promise<void>
    updateGame: (game: IGame) => Promise<void>
    deleteGame: (id: number) => void
    changeQuantity: (id: number, quantity: number) => void
    searchType: SearchType
    setSearchType: (type: SearchType) => void
    searchQuery: string
    setSearchQuery: (query: string) => void
    SearchedGames: IGame[]
}