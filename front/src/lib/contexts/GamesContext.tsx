'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from './AuthContext';

export interface Game {
  id:number;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  amount: number;
  quantity: number;
}

interface GamesContextType {
  games: Game[]
  loading: boolean
  addGame: (game: Partial<Game>) => void
  updateGame: (id: number, updates: Partial<Game>) => Promise<void>
  updateGameAvailability: (id: number, rentedQuantity: number) => void
  deleteGame: (id: number) => void
}

const GamesContext = createContext<GamesContextType | undefined>(undefined)

export function GamesProvider({ children }: { children: ReactNode }) {
  const {JWT, permissions} = useAuth()
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    getGames();
  }, [permissions])

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
      }, body: JSON.stringify(game)}).then((res)=>{
        if(!res.ok)
          return Promise.reject(new Error(res.statusText, {cause: res.status}))
        getGames();
      }).catch((error)=>{
        throw new error
      })
  }

  /**
   * Aktualizuje dane gry
   * @param {string} id - ID gry do aktualizacji
   * @param {Partial<Game>} updates - Częściowe dane do aktualizacji
   */
  const updateGame = async (id: number, updates: Partial<Game>) => {
      fetch(`http://localhost:3001/game/update/${id}`, {
        method: 'PATCH', 
        headers: { 
          'Content-Type': 'application/json',
          "token": `${JWT}`,
          "permissions": permissions
      }, body: JSON.stringify(updates)}).then((res)=>{
        if(!res.ok)
          return Promise.reject(new Error(res.statusText, {cause: res.status}))
        getGames();
      }).catch((error)=>{
        throw new error
      })
  }

  /**
   * Aktualizuje dostępność gry na podstawie liczby wypożyczonych egzemplarzy
   * @param {string} id - ID gry
   * @param {number} rentedQuantity - Liczba wypożyczonych egzemplarzy
   */
  const updateGameAvailability = (id: number, rentedQuantity: number) => {
    //TODO
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
      getGames();
    })
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