'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { GamesContextType, SearchType } from '@/types/gameContext';
import { IGame } from '@/interfaces/game';
import { Method, request } from '@/interfaces/api';
import { io } from 'socket.io-client';

const GamesContext = createContext<GamesContextType | undefined>(undefined)

export function GamesProvider({ children }: { children: ReactNode }) {
  const [games, setGames] = useState<IGame[]>([])
  const [loading, setLoading] = useState(true)
  const [searchType, setSearchType] = useState<SearchType>('title')
  const [searchQuery, setSearchQuery] = useState('')

  const getGames = useCallback(() => {
    request<IGame[]>("games", Method.GET)
      .then((res) => setGames(res))
      .finally(() => setLoading(false))
  }, []);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_WS_URL + "games", {
      transports: ["websocket"],
      reconnectionDelay: 2500,
      reconnectionAttempts: 10,
    });
  
    socket.on("connect", getGames);
    socket.on("gameQuantityChange", (game: IGame) => {
      setGames(prev =>
        prev.map(g => g.id === game.id ? game : g)
      );
    });
  
    return () => {
      socket.off();
      socket.disconnect();
    };
  }, [getGames]);

  const SearchedGames = [...games]
    .filter(game => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    
    switch (searchType) {
      case 'title':
        return game.title.toLowerCase().includes(searchLower)
      case 'category':
        return game.category.toLowerCase().includes(searchLower)
    }
  })
  
  const addGame = async (game: Omit<IGame, 'id'>) => {
    return request('game', Method.POST, JSON.stringify(game)).then((response: any)=>setGames([...games, {id: +response.identifiers[0].id, ...game}]))
  }

  /**
   * Updates game data
   * @param {string} id - ID game to update
   * @param {Partial<Game>} updates - Partial data to update
   */
  const updateGame = async (game: IGame) => {
    return request<void>(`game/${game.id}`, Method.PATCH, JSON.stringify(game)).then(()=>setGames(games.map<IGame>((Oldgame)=>Oldgame.id == game.id ? game : Oldgame)))
  }

  const deleteGame = (id: number) => {
    return request<void>(`game/${id}`, Method.DELETE).then(()=>setGames(games.filter((game)=> game.id !== id)))
  }

  return (
    <GamesContext.Provider value={{ games, loading, addGame, updateGame, deleteGame, searchType, setSearchType, searchQuery, setSearchQuery, SearchedGames }}>
      {children}
    </GamesContext.Provider>
  )
}

/**
 * Hook to use the games context
 * @returns {GamesContextType} Games context
 * @throws {Error} If hook is used outside of GamesProvider
 */
export function useGames() {
  const context = useContext(GamesContext)
  if (context === undefined) {
    throw new Error('useGames must be used within a GamesProvider')
  }
  return context
} 