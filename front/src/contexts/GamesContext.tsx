'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from './AuthContext';
import { GamesContextType, SearchType } from '@/types/gameContext';
import { IGame } from '@/interfaces/game';
import { stream } from '@/interfaces/api';

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
  
  const addGame = (game: Partial<IGame>) => {
    fetch('http://localhost:3001/game/add', {
      method: 'POST', 
      headers: { 
        'Content-Type': 'application/json',
        "token": `${JWT}`,
        "permissions": permissions
      }, body: JSON.stringify(game)}).then((res)=>{
        if(!res.ok)
          return Promise.reject(new Error(res.statusText, {cause: res.status}))
      }).catch((error)=>{
        throw new error
      })
  }

  /**
   * Updates game data
   * @param {string} id - ID game to update
   * @param {Partial<Game>} updates - Partial data to update
   */
  const updateGame = async (id: number, updates: Partial<IGame>) => {
      fetch(`http://localhost:3001/game/update/${id}`, {
        method: 'PATCH', 
        headers: { 
          'Content-Type': 'application/json',
          "token": `${JWT}`,
          "permissions": permissions
      }, body: JSON.stringify(updates)}).then((res)=>{
        if(!res.ok)
          return Promise.reject(new Error(res.statusText, {cause: res.status}))
      }).catch((error)=>{
        throw new error
      })
  }

  const changeQuantity = async (id: number, quantity: number) => {
    fetch(`http://localhost:3001/game/change-quantity`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        "token": `${JWT}`,
        "permissions": permissions
      },
      body: JSON.stringify({ id, quantity })
    }).then((res) => {
      if(!res.ok)
        return Promise.reject(new Error(res.statusText, {cause: res.status}))
    }).catch((error) => {
      throw new error
    })
  }

  const deleteGame = (id: number) => {
    fetch(`http://localhost:3001/game/delete/${id}`, {
      method: 'DELETE', 
      headers: { 
        'Content-Type': 'application/json',
        "token": `${JWT}`,
        "permissions": permissions
    }}).then((res)=>{
      if(!res.ok)
        return Promise.reject(new Error(res.statusText, {cause: res.status}))
    })
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