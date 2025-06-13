"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext';
import { useGames } from './GamesContext';
import { useRentals } from './RentalsContext';

const LoadingContext = createContext<{loading: boolean} | undefined>(undefined)

export function LoadingProvider({ children }: { children: ReactNode }) {
    const { loading: authLoading } = useAuth()
    const { loading: gamesLoading } = useGames()
    const { loading: rentalsLoading } = useRentals()
    const [ loading, setLoading ] = useState(false)

    useEffect(() => {
        setLoading(authLoading || gamesLoading || rentalsLoading)
    }, [authLoading, gamesLoading, rentalsLoading])

    return (
        <LoadingContext.Provider value={{ loading }}>
          {children}
        </LoadingContext.Provider>
      )
}

export function useLoading() {
    const context = useContext(LoadingContext)
    if (context === undefined) {
      throw new Error('useLang must be used within a LanguageProvider')
    }
    return context
} 