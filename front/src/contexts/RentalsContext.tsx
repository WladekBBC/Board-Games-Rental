'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { IRental } from '@/interfaces/rental'
import { RentalsContextType, SortConfig, SearchType } from '@/types/rentalContext'
import { Method, request } from '@/interfaces/api'
import { useAuth } from './AuthContext'
import { Socket, io } from 'socket.io-client'

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
  const [socket, setSocket] = useState<Socket>();
  const [rentals, setRentals] = useState<IRental[]>([])
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'rentedAt', direction: 'desc' })
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState<SearchType>('title')

  const { JWT } = useAuth()
  
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

  useEffect(() => {
    if(JWT){
      setSocket(
        io(process.env.NEXT_PUBLIC_API_URL + "rentals", {
          transports: ["websocket"],
          autoConnect: true,
          reconnectionDelay: 2500,
          reconnectionAttempts: 10,
          auth: {
            token: JWT,
          }
        })
        .on("connect", getAllRentals)
        .on("reconnect", getAllRentals)
        .on("error", (error) => {})
        .on('rentalCreated', (rental: IRental) => {
          setRentals((prev) => [...prev, rental])
        })
        .on('rentalStatusChanged', (rental: IRental) => {
          setRentals((prev) => prev.map((r) => r.id === rental.id ? rental : r))
        })
        .on('rentalDeleted', (id: number) => {
          setRentals((prev) => prev.filter((r) => r.id !== id))
        })
      )
  
      return () => {
        if(socket){
          setSocket((prev) => (
            prev ? prev.removeAllListeners() : undefined
          ))
        }
      };
    }
  }, [JWT]);

  const getAllRentals = () => {
    setLoading(true)
    request<IRental[]>("rental", Method.GET).then((res) => setRentals(res))
    setLoading(false)
  }

  const rentalAction = (action: "add" | "return" | "delete", data: Partial<IRental>, handleSuccess: () => any, handleError: (error: Error) => any) => {
    socket!.emit(action, data)
      .once(`${action}Status`, (res: any) => {
        if(res?.status && res.status === 200)
          handleSuccess();
        else
          handleError(res)
      })
  }

  return (
    <RentalsContext.Provider value={{ 
      rentals, 
      loading, 
      rentalAction,
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