import { IGame } from "@/interfaces/game"


export type SearchType = 'title' | 'category';

export type GamesContextType = {
    games: IGame[]
    loading: boolean
    addGame: (game: Partial<IGame>) => Promise<void>
    updateGame: (id: number, updates: IGame) => Promise<void>
    deleteGame: (id: number) => void
    changeQuantity: (id: number, quantity: number) => Promise<void>
    searchType: SearchType
    setSearchType: (type: SearchType) => void
    searchQuery: string
    setSearchQuery: (query: string) => void
    SearchedGames: IGame[]
}