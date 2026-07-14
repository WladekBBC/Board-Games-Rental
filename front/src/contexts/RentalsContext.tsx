'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react'
import { IRental } from '@/interfaces/rental'
import { RentalsContextType, SortConfig, SearchType } from '@/types/rentalContext'
import { Method, request } from '@/interfaces/api'
import { useAuth } from './AuthContext'
import { io, Socket } from 'socket.io-client'
import { getWsUrl } from '@/lib/env'

const RentalsContext = createContext<RentalsContextType | undefined>(undefined)

export function RentalsProvider({ children }: { children: ReactNode }) {
  const socketRef = useRef<Socket | null>(null)
  const [rentals, setRentals] = useState<IRental[]>([])
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'rentedAt', direction: 'desc' })
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState<SearchType>('title')

  const { JWT } = useAuth()

  const getAllRentals = useCallback(() => {
    setLoading(true)
    request<IRental[]>("rental", Method.GET)
      .then((res) => setRentals(res))
      .finally(() => setLoading(false))
  }, [])
  
  const filteredAndSortedRentals = [...rentals]
    .filter(rental => {
      if (!searchQuery) return true;
      
      const searchLower = searchQuery.toLowerCase();
      
      switch (searchType) {
        case 'index':
          return rental.index.toLowerCase().includes(searchLower);
        case 'title':
          return rental.game.title.toLowerCase().includes(searchLower);
        case 'date': {
          const rentDate = new Date(rental.rentedAt).toLocaleDateString();
          const returnDate = rental.returnedAt ? new Date(rental.returnedAt).toLocaleDateString() : '';
          return rentDate.includes(searchLower) || returnDate.includes(searchLower);
        }
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
    if (!JWT) {
      setRentals([])
      setLoading(false)
      return
    }

    const socket = io(`${getWsUrl()}/rentals`, {
      transports: ["websocket"],
      autoConnect: true,
      reconnectionDelay: 2500,
      reconnectionAttempts: 10,
      auth: {
        token: JWT,
      },
    })

    socket.on("connect", getAllRentals)
    socket.on("reconnect", getAllRentals)
    socket.on('rentalCreated', (rental: IRental) => {
      setRentals((prev) =>
        prev.some((existing) => existing.id === rental.id)
          ? prev
          : [...prev, rental],
      )
    })
    socket.on('rentalStatusChanged', (rental: IRental) => {
      setRentals((prev) => prev.map((r) => r.id === rental.id ? rental : r))
    })
    socket.on('rentalDeleted', (id: number) => {
      setRentals((prev) => prev.filter((r) => r.id !== id))
    })

    socketRef.current = socket

    return () => {
      socket.off("connect", getAllRentals)
      socket.off("reconnect", getAllRentals)
      socket.off("rentalCreated")
      socket.off("rentalStatusChanged")
      socket.off("rentalDeleted")
      socket.disconnect()
      socketRef.current = null
    }
  }, [JWT, getAllRentals]);

  const rentalAction = (
    action: "add" | "return" | "delete",
    data: Partial<IRental>,
    handleSuccess: () => void,
    handleError: (error: Error) => void,
  ) => {
    const socket = socketRef.current
    if (!socket) {
      handleError(new Error("Socket not connected"))
      return
    }

    socket.emit(action, data)
    socket.once(`${action}Status`, (res: { status?: number; message?: string }) => {
      if (res?.status === 200) {
        handleSuccess()
      } else {
        handleError(new Error(res?.message ?? "Request failed", { cause: res?.status }))
      }
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

export function useRentals() {
  const context = useContext(RentalsContext)
  if (context === undefined) {
    throw new Error('useRentals must be used within a RentalsProvider')
  }
  return context
}
