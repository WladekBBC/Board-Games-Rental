'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useGames } from './GamesContext'
import { useLang } from '@/lib/contexts/LanguageContext'

interface GameRental {
  id: string
  gameId: string
  personId: string
  rentedAt: string
  returnedAt?: string
}

/**
 * Rentals context type
 * @interface RentalsContextType
 */
interface RentalsContextType {
  rentals: GameRental[]
  loading: boolean
  addRental: (rental: Omit<GameRental, 'id' | 'rentedAt'>) => void
  updateRental: (id: string, updates: Partial<GameRental>) => void
  returnGame: (id: string) => void
  deleteRental: (id: string) => void
}

const RentalsContext = createContext<RentalsContextType | undefined>(undefined)

/**
 * Rentals context provider
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Component children
 * @returns {JSX.Element} Rentals context provider
 */
export function RentalsProvider({ children }: { children: ReactNode }) {
  const [rentals, setRentals] = useState<GameRental[]>([])
  const [loading, setLoading] = useState(true)
  const { updateGameAvailability, games } = useGames()
  const { language } = useLang()

  /**
   * Loads rentals from localStorage when application starts
   */
  useEffect(() => {
    const loadRentals = () => {
      try {
        const savedRentals = localStorage.getItem('rentals')
        if (savedRentals) {
          const parsedRentals = JSON.parse(savedRentals)
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

  /**
   * Updates the number of rented game instances
   * @param {string} gameId - Game ID
   */
  const updateGameRentedQuantity = (gameId: string) => {
    const activeRentals = rentals.filter(rental => 
      rental.gameId === gameId && !rental.returnedAt
    ).length
    updateGameAvailability(gameId, activeRentals)
  }

  /**
   * Adds a new rental
   * @param {Omit<GameRental, 'id' | 'rentedAt'>} rental - Rental data (without ID and rental date)
   * @throws {Error} If game does not exist or is not available
   */
  const addRental = (rental: Omit<GameRental, 'id' | 'rentedAt'>) => {
    const game = games.find(g => g.id === rental.gameId)
    if (!game) {
      throw new Error(language.gameNotFound)
    }

    const activeRentalsCount = rentals.filter(r => 
      r.gameId === rental.gameId && !r.returnedAt
    ).length

    if (activeRentalsCount >= game.quantity) {
      throw new Error(language.gameUnavailableMessage)
    }

    const newRental = {
      ...rental,
      id: Date.now().toString(),
      rentedAt: new Date().toISOString()
    }
    
    const updatedRentals = [newRental, ...rentals]
    setRentals(updatedRentals)
    localStorage.setItem('rentals', JSON.stringify(updatedRentals))
    updateGameRentedQuantity(rental.gameId)
  }

  /**
   * Updates the rental data
   * @param {string} id - Rental ID
   * @param {Partial<GameRental>} updates - Partial data to update
   */
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

  /**
   * Marks the game as returned
   * @param {string} id - Rental ID
   */
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

  /**
   * Deletes the rental
   * @param {string} id - Rental ID to delete
   */
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
      loading, 
      addRental, 
      updateRental, 
      returnGame, 
      deleteRental 
    }}>
      {children}
    </RentalsContext.Provider>
  )
}

/**
 * Hook to use the rentals context
 * @returns {RentalsContextType} Rentals context
 * @throws {Error} If hook is used outside of RentalsProvider
 */
export function useRentals() {
  const context = useContext(RentalsContext)
  if (context === undefined) {
    throw new Error('useRentals must be used within a RentalsProvider')
  }
  return context
} 