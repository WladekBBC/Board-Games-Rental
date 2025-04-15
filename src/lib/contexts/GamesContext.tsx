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
    // Завантажуємо ігри з localStorage при старті
    const loadGames = () => {
      try {
        const savedGames = localStorage.getItem('games')
        if (savedGames) {
          setGames(JSON.parse(savedGames))
        } else {
          // Додаємо початкові дані, якщо localStorage порожній
          const initialGames = [
            {
              id: '1',
              title: 'Монополія',
              description: 'Класична гра про бізнес та нерухомість',
              imageUrl: '/images/monopoly.jpg',
              category: 'Стратегія',
              isAvailable: true,
              quantity: 2
            },
            {
              id: '2',
              title: 'Шахи',
              description: 'Класична гра для розвитку логіки',
              imageUrl: '/images/chess.jpg',
              category: 'Стратегія',
              isAvailable: true,
              quantity: 3
            },
            {
              id: '3',
              title: 'Скрабл',
              description: 'Гра в слова',
              imageUrl: '/images/scrabble.jpg',
              category: 'Словесна',
              isAvailable: true,
              quantity: 1
            }
          ]
          setGames(initialGames)
          localStorage.setItem('games', JSON.stringify(initialGames))
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
        // Aktualizujemy dostępność na podstawie ilości dostępnych egzemplarzy
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
    const updatedGames = games.filter(g => g.id !== id)
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