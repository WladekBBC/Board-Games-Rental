'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from './AuthContext';
import { GamesContextType } from '@/types/gameContext';
import { IGame } from '@/interfaces/game';
import { Method, request } from '@/interfaces/api';

const GamesContext = createContext<GamesContextType | undefined>(undefined)

export function GamesProvider({ children }: { children: ReactNode }) {
  const {JWT, permissions} = useAuth()
  const [games, setGames] = useState<IGame[]>([])
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    getGames();
  }, [JWT])

  const getGames = () =>{
    request<IGame[]>('http://localhost:3001/game/games', Method.GET, {"token": `${JWT}`, "permissions": permissions}).then((res: IGame[])=>{
      setGames(res)
      setLoading(false)
    }).catch((error)=>{
      console.log(error)
    })
  }

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