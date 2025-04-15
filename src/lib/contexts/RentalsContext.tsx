'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useGames } from './GamesContext'

interface GameRental {
  id: string
  gameId: string
  personId: string
  rentedAt: string
  returnedAt?: string
}

interface RentalsContextType {
  rentals: GameRental[]
  addRental: (rental: Omit<GameRental, 'id' | 'rentedAt'>) => void
  updateRental: (id: string, rental: Partial<GameRental>) => void
  deleteRental: (id: string) => void
  returnGame: (id: string) => void
  loading: boolean
}

const RentalsContext = createContext<RentalsContextType | undefined>(undefined)

export function RentalsProvider({ children }: { children: ReactNode }) {
  const [rentals, setRentals] = useState<GameRental[]>([])
  const [loading, setLoading] = useState(true)
  const { updateGameAvailability, games } = useGames()

  useEffect(() => {
    // Завантажуємо оренди з localStorage при старті
    const loadRentals = () => {
      try {
        const savedRentals = localStorage.getItem('rentals')
        if (savedRentals) {
          const parsedRentals = JSON.parse(savedRentals)
          // Сортуємо оренди за датою (нові зверху)
          const sortedRentals = parsedRentals.sort((a: GameRental, b: GameRental) => 
            new Date(b.rentedAt).getTime() - new Date(a.rentedAt).getTime()
          )
          setRentals(sortedRentals)
        }
      } catch (error) {
        console.error('Помилка при завантаженні оренд:', error)
      } finally {
        setLoading(false)
      }
    }

    loadRentals()
  }, [])

  const updateGameRentedQuantity = (gameId: string) => {
    const activeRentals = rentals.filter(rental => 
      rental.gameId === gameId && !rental.returnedAt
    ).length
    updateGameAvailability(gameId, activeRentals)
  }

  const addRental = (rental: Omit<GameRental, 'id' | 'rentedAt'>) => {
    // Sprawdzamy dostępność gry przed wypożyczeniem
    const game = games.find(g => g.id === rental.gameId)
    if (!game) {
      throw new Error('Гра не знайдена')
    }

    const activeRentalsCount = rentals.filter(r => 
      r.gameId === rental.gameId && !r.returnedAt
    ).length

    if (activeRentalsCount >= game.quantity) {
      throw new Error('Гра недоступна для оренди - всі екземпляри вже орендовані')
    }

    const newRental = {
      ...rental,
      id: Date.now().toString(),
      rentedAt: new Date().toISOString()
    }
    
    // Dodajemy nowe wypożyczenie na początku listy
    const updatedRentals = [newRental, ...rentals]
    setRentals(updatedRentals)
    localStorage.setItem('rentals', JSON.stringify(updatedRentals))
    updateGameRentedQuantity(rental.gameId)
  }

  const updateRental = (id: string, updates: Partial<GameRental>) => {
    const updatedRentals = rentals.map(rental => {
      if (rental.id === id) {
        const updatedRental = { ...rental, ...updates }
        return updatedRental
      }
      return rental
    })
    setRentals(updatedRentals)
    localStorage.setItem('rentals', JSON.stringify(updatedRentals))
  }

  const returnGame = (id: string) => {
    const rental = rentals.find(r => r.id === id)
    if (rental) {
      const updatedRentals = rentals.map(r => 
        r.id === id ? { ...r, returnedAt: new Date().toISOString() } : r
      )
      setRentals(updatedRentals)
      localStorage.setItem('rentals', JSON.stringify(updatedRentals))
      updateGameRentedQuantity(rental.gameId)
    }
  }

  const deleteRental = (id: string) => {
    const rental = rentals.find(r => r.id === id)
    if (rental) {
      const updatedRentals = rentals.filter(r => r.id !== id)
      setRentals(updatedRentals)
      localStorage.setItem('rentals', JSON.stringify(updatedRentals))
      updateGameRentedQuantity(rental.gameId)
    }
  }

  return (
    <RentalsContext.Provider value={{ 
      rentals, 
      addRental, 
      updateRental, 
      deleteRental,
      returnGame,
      loading 
    }}>
      {children}
    </RentalsContext.Provider>
  )
}

export const useRentals = () => {
  const context = useContext(RentalsContext)
  if (!context) {
    throw new Error('useRentals must be used within a RentalsProvider')
  }
  return context
} 