'use client'

import { ReactNode } from 'react'
import { AuthProvider } from '@/contexts/AuthContext'
import { GamesProvider } from '@/contexts/GamesContext'
import { RentalsProvider } from '@/contexts/RentalsContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { LanguageProvider } from '@/contexts/LanguageContext'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <GamesProvider>
            <RentalsProvider>
              {children}
            </RentalsProvider>
          </GamesProvider>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  )
} 