'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from "@/lib/contexts/AuthContext"
import { GamesProvider } from "@/lib/contexts/GamesContext"
import { RentalsProvider } from "@/lib/contexts/RentalsContext"
import { LanguageProvider } from "@/lib/contexts/LanguageContext"
import { ThemeProvider } from "@/lib/contexts/ThemeContext"
import { Navbar } from '@/components/Navbar/Navbar'

const inter = Inter({ subsets: ['latin'] })

/**
 * Client-side layout component that provides context providers
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be rendered
 * @returns {JSX.Element} The client layout with all necessary providers
 */
export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl" className="light">
      <body className={`${inter.className} transition-colors duration-200`}>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <GamesProvider>
                <RentalsProvider>
                  <Navbar />
                  <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
                    {children}
                  </main>
                </RentalsProvider>
              </GamesProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
} 