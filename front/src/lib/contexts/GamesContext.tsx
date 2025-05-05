'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from './AuthContext';

export interface Game {
  id:number;
  title: string;
  desc: string;
  imageUrl: string;
  category: string;
  amount: number;
  quantity?: number;
}

interface GamesContextType {
  games: Game[]
  loading: boolean
  addGame: (game: Partial<Game>) => void
  updateGame: (id: string, updates: Partial<Game>) => void
  updateGameAvailability: (id: string, rentedQuantity: number) => void
  deleteGame: (id: number) => void
}

const GamesContext = createContext<GamesContextType | undefined>(undefined)

export function GamesProvider({ children }: { children: ReactNode }) {
  const {JWT, permissions} = useAuth()
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    getGames();
  }, [])

  const getGames = () =>{
    fetch('http://localhost:3001/game/games', {
      method: 'GET', 
      headers: { 
        'Content-Type': 'application/json',
        "token": `${JWT}`,
        "permissions": permissions
      }}).then((res)=>{
        if (!res.ok) 
          throw new Error(`Failed to fetch games: ${res.status} ${res.statusText}`);
        return res.json()
      }).then((res: Game[])=>{
        setGames(res)
        setLoading(false)
      }).catch((error)=>{
        console.log(error)
      })
  }

  const addGame = (game: Partial<Game>) => {
    fetch('http://localhost:3001/game/add', {
      method: 'POST', 
      headers: { 
        'Content-Type': 'application/json',
        "token": `${JWT}`,
        "permissions": permissions
      }, body: JSON.stringify(game)})
  }

  /**
   * Aktualizuje dane gry
   * @param {string} id - ID gry do aktualizacji
   * @param {Partial<Game>} updates - Częściowe dane do aktualizacji
   */
  const updateGame = (id: string, updates: Partial<Game>) => {
      fetch(`http://localhost:3001/game/update/${id}`, {
        method: 'PATCH', 
        headers: { 
          'Content-Type': 'application/json',
          "token": `${JWT}`,
          "permissions": permissions
      }, body: JSON.stringify(updates)})
  }

  /**
   * Aktualizuje dostępność gry na podstawie liczby wypożyczonych egzemplarzy
   * @param {string} id - ID gry
   * @param {number} rentedQuantity - Liczba wypożyczonych egzemplarzy
   */
  const updateGameAvailability = (id: string, rentedQuantity: number) => {
    //TODO
  }

  const deleteGame = (id: number) => {
    fetch(`http://localhost:3001/game/delete/${id}`, {
      method: 'DELETE', 
      headers: { 
        'Content-Type': 'application/json',
        "token": `${JWT}`,
        "permissions": permissions
    }})
  }

  return (
    <GamesContext.Provider value={{ games, loading, addGame, updateGame, updateGameAvailability, deleteGame }}>
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