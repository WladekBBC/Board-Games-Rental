'use client'

import { ReactNode } from 'react'
import { AuthProvider } from '@/contexts/AuthContext'
import { GamesProvider } from '@/contexts/GamesContext'
import { RentalsProvider } from '@/contexts/RentalsContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { UsersProvider } from '@/contexts/UsersContext'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <GamesProvider>
            <RentalsProvider>
              <UsersProvider>
                {children}
              </UsersProvider>
            </RentalsProvider>
          </GamesProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
} 