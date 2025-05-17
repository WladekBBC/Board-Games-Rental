'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useLang } from '@/contexts/LanguageContext'
import HomeUserPanel from '@/components/HomePage/HomeUserPanel'
import GameList from '@/components/HomePage/GameList'

/**
 * Home page
 * @returns {React.ReactNode}
 */
export default function Home() {
  const { user, loading: authLoading } = useAuth()
  const { language } = useLang()

  return (
    <main className="container mx-auto px-4 py-8">

      <h1 className="text-3xl font-bold mb-8">{language.appTitle}</h1>
      <HomeUserPanel />
      <GameList />
    </main>
  )
}
