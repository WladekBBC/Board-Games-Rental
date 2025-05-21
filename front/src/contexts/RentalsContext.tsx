'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { IRental } from '@/interfaces/rental'
import { RentalsContextType, SortConfig, SearchType } from '@/types/rentalContext'
import { Method, request, stream } from '@/interfaces/api'
import { useAuth } from './AuthContext'

/**
 * Rentals context type
 * @interface RentalsContextType
 */

const RentalsContext = createContext<RentalsContextType | undefined>(undefined)

/**
 * Rentals context provider
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Component children
 * @returns {JSX.Element} Rentals context provider
 */
export function RentalsProvider({ children }: { children: ReactNode }) {
  const [rentals, setRentals] = useState<IRental[]>([])
  const [loading, setLoading] = useState(true)
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'rentedAt', direction: 'desc' })
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState<SearchType>('index')

  const { JWT } = useAuth()

  useEffect(() => {
    if(JWT) {
      stream('http://localhost:3001/rental/stream-rentals', setRentals, {})
    }
    setLoading(false)
  }, [JWT])

  const filteredAndSortedRentals = [...rentals]
    .filter(rental => {
      if (!searchQuery) return true;
      
      const searchLower = searchQuery.toLowerCase();
      
      switch (searchType) {
        case 'index':
          return rental.index.toLowerCase().includes(searchLower);
        case 'title':
          return rental.game.title.toLowerCase().includes(searchLower);
        case 'date':
          const rentDate = new Date(rental.rentedAt).toLocaleDateString();
          const returnDate = rental.returnedAt ? new Date(rental.returnedAt).toLocaleDateString() : '';
          return rentDate.includes(searchLower) || returnDate.includes(searchLower);
        default:
          return true;
      }
    })
    .sort((a: IRental, b) => {
      if (sortConfig.key === 'title') {
        return sortConfig.direction === 'asc' 
          ? a.game.title.localeCompare(b.game.title)
          : b.game.title.localeCompare(a.game.title);
      }
      
      if (sortConfig.key === 'rentedAt') {
        return sortConfig.direction === 'asc'
          ? new Date(a.rentedAt).getTime() - new Date(b.rentedAt).getTime()
          : new Date(b.rentedAt).getTime() - new Date(a.rentedAt).getTime();
      }
      
      return sortConfig.direction === 'asc'
        ? a.index.localeCompare(b.index)
        : b.index.localeCompare(a.index);
    });

  const addRental = async (rental: Partial<IRental>) =>{
    return request<null>('http://localhost:3001/rental/add', Method.POST, JSON.stringify(rental))
  }

  const returnGame = async (id: number) =>{
    return request('http://localhost:3001/rental/return/'+id, Method.PATCH)
  }

  const removeRental = async (id: number) =>{
    return request('http://localhost:3001/rental/delete/'+id, Method.DELETE)
  }

  return (
    <RentalsContext.Provider value={{ 
      rentals, 
      loading, 
      addRental, 
      returnGame, 
      removeRental,
      sortConfig,
      setSortConfig,
      searchQuery,
      setSearchQuery,
      searchType,
      setSearchType,
      filteredAndSortedRentals
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