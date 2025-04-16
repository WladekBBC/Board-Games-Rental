'use client'

import { ReactNode } from 'react'
import { AuthProvider } from '@/lib/contexts/AuthContext'
import { GamesProvider } from '@/lib/contexts/GamesContext'
import { RentalsProvider } from '@/lib/contexts/RentalsContext'
import { ThemeProvider } from '@/lib/contexts/ThemeContext'
import { LanguageProvider } from '@/lib/contexts/LanguageContext'

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