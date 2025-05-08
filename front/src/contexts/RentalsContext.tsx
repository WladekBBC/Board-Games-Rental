'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useGames } from './GamesContext'
import { useLang } from '@/contexts/LanguageContext'
import { IRental } from '@/interfaces/rental'
import { RentalsContextType } from '@/types/rentalContext'
import { Method, request } from '@/interfaces/api'
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
  const [error, setError] = useState("")

  const { JWT, permissions } = useAuth()

  useEffect(() => {
    if(JWT)
      getRentals()
    setLoading(false)
  }, [JWT])

  const getRentals = () =>{
    request<IRental[]>('http://localhost:3001/rental/rentals', Method.GET, {"token": `${JWT}`, "permissions": permissions}).then((res: IRental[])=>{
      setRentals(res)
    })
  }

  const addRental = async (rental: Partial<IRental>) =>{
    setLoading(true)

    return request<null>('http://localhost:3001/rental/add', Method.POST, {"token": `${JWT}`, "permissions": permissions}, JSON.stringify(rental))
    .finally(()=>{
      getRentals()
      setLoading(false)
    })
  }

  const returnGame = async (id: number) =>{
    setLoading(true)

    return request('http://localhost:3001/rental/return/'+id, Method.PATCH, {"token": `${JWT}`, "permissions": permissions})
    .finally(()=>{
      getRentals()
      setLoading(false)
    })
  }

  return (
    <RentalsContext.Provider value={{ 
      rentals, 
      loading, 
      addRental, 
      returnGame, 
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