import { IGame } from "@/interfaces/game"


export type SearchType = 'title' | 'category';

export type GamesContextType = {
    games: IGame[]
    loading: boolean
    searchQuery: string
    searchType: SearchType
    SearchedGames: IGame[]
    addGame: (game: Omit<IGame, 'id'>) => Promise<void>
    updateGame: (game: IGame) => Promise<void>
    deleteGame: (id: number) => void
    setSearchType: (type: SearchType) => void
    setSearchQuery: (query: string) => void
}