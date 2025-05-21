'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from './AuthContext';
import { GamesContextType, SearchType } from '@/types/gameContext';
import { IGame } from '@/interfaces/game';
import { Method, request, stream } from '@/interfaces/api';

const GamesContext = createContext<GamesContextType | undefined>(undefined)

export function GamesProvider({ children }: { children: ReactNode }) {
  const {JWT, permissions} = useAuth()
  const [games, setGames] = useState<IGame[]>([])
  const [loading, setLoading] = useState(true)
  const [searchType, setSearchType] = useState<SearchType>('title')
  const [searchQuery, setSearchQuery] = useState('')
  
  useEffect(() => {
    stream('http://localhost:3001/game/stream-games', setGames)
    setLoading(false)
  }, [])

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
  
  const addGame = async (game: Partial<IGame>) => {
    return request<undefined>('http://localhost:3001/game/add', Method.POST, {"token": `${JWT}`, "permissions": permissions }, JSON.stringify(game))
  }

  /**
   * Updates game data
   * @param {string} id - ID game to update
   * @param {Partial<Game>} updates - Partial data to update
   */
  const updateGame = async (id: number, updates: Partial<IGame>) => {
    return request<undefined>(`http://localhost:3001/game/update/${id}`, Method.PATCH, {"token": `${JWT}`, "permissions": permissions}, JSON.stringify(updates))
  }

  const changeQuantity = async (id: number, quantity: number) => {
    return request<undefined>(`http://localhost:3001/game/change-quantity`, Method.PATCH, {"token": `${JWT}`, "permissions": permissions}, JSON.stringify({ id, quantity }))
  }

  const deleteGame = (id: number) => {
    return request<undefined>(`http://localhost:3001/game/delete/${id}`, Method.DELETE, {"token": `${JWT}`, "permissions": permissions})
  }

  return (
    <GamesContext.Provider value={{ games, loading, addGame, updateGame, deleteGame, changeQuantity, searchType, setSearchType, searchQuery, setSearchQuery, SearchedGames }}>
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