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

/**
 * Kontekst zarządzający kolekcją gier planszowych
 * @interface GamesContextType
 */
interface GamesContextType {
  games: Game[]
  loading: boolean
  addGame: (game: Omit<Game, 'id'>) => void
  updateGame: (id: string, updates: Partial<Game>) => void
  updateGameAvailability: (id: string, rentedQuantity: number) => void
  deleteGame: (id: string) => void
}

const GamesContext = createContext<GamesContextType | undefined>(undefined)

/**
 * Dostawca kontekstu gier planszowych
 * @param {Object} props - Właściwości komponentu
 * @param {ReactNode} props.children - Dzieci komponentu
 * @returns {JSX.Element} Dostawca kontekstu
 */
export function GamesProvider({ children }: { children: ReactNode }) {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)

  /**
   * Ładuje gry z localStorage przy inicjalizacji
   */
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

  /**
   * Dodaje nową grę do kolekcji
   * @param {Omit<Game, 'id'>} game - Dane nowej gry (bez ID)
   */
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

  /**
   * Aktualizuje dane gry
   * @param {string} id - ID gry do aktualizacji
   * @param {Partial<Game>} updates - Częściowe dane do aktualizacji
   */
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

  /**
   * Aktualizuje dostępność gry na podstawie liczby wypożyczonych egzemplarzy
   * @param {string} id - ID gry
   * @param {number} rentedQuantity - Liczba wypożyczonych egzemplarzy
   */
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