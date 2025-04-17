'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface Game {
  id: string
  title: string
  description: string
  imageUrl: string
  category: string
  isAvailable: boolean
  quantity: number // Кількість доступних екземплярів
  availableQuantity?: number
}

interface GamesContextType {
  games: Game[]
  addGame: (game: Omit<Game, 'id'>) => void
  updateGame: (id: string, game: Partial<Game>) => void
  updateGameAvailability: (id: string, rentedQuantity: number) => void
  deleteGame: (id: string) => void
  loading: boolean
}

const GamesContext = createContext<GamesContextType | undefined>(undefined)

export function GamesProvider({ children }: { children: ReactNode }) {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadGames = () => {
      try {
        const savedGames = localStorage.getItem('games')
        if (savedGames) {
          setGames(JSON.parse(savedGames))
        }
      } catch (error) {
        console.error('Помилка при завантаженні ігор:', error)
      } finally {
        setLoading(false)
      }
    }

    loadGames()
  }, [])

  const addGame = (game: Omit<Game, 'id'>) => {
    const newGame = {
      ...game,
      id: Date.now().toString(),
      isAvailable: game.quantity > 0
    }
    const updatedGames = [...games, newGame]
    setGames(updatedGames)
    localStorage.setItem('games', JSON.stringify(updatedGames))
  }

  const updateGame = (id: string, updates: Partial<Game>) => {
    const updatedGames = games.map(game => {
      if (game.id === id) {
        const updatedGame = { ...game, ...updates }
        if (typeof updates.quantity !== 'undefined') {
          updatedGame.isAvailable = updatedGame.quantity > 0
        }
        return updatedGame
      }
      return game
    })
    setGames(updatedGames)
    localStorage.setItem('games', JSON.stringify(updatedGames))
  }

  const updateGameAvailability = (id: string, rentedQuantity: number) => {
    const updatedGames = games.map(game => {
      if (game.id === id) {
        const availableQuantity = game.quantity - rentedQuantity
        return {
          ...game,
          isAvailable: availableQuantity > 0,
          availableQuantity
        }
      }
      return game
    })
    setGames(updatedGames)
    localStorage.setItem('games', JSON.stringify(updatedGames))
  }

  const deleteGame = (id: string) => {
    const updatedGames = games.filter(game => game.id !== id)
    setGames(updatedGames)
    localStorage.setItem('games', JSON.stringify(updatedGames))
  }

  return (
    <GamesContext.Provider value={{
      games,
      addGame,
      updateGame,
      updateGameAvailability,
      deleteGame,
      loading
    }}>
      {children}
    </GamesContext.Provider>
  )
}

export function useGames() {
  const context = useContext(GamesContext)
  if (context === undefined) {
    throw new Error('useGames must be used within a GamesProvider')
  }
  return context
} 