'use client'

import { useAuth } from '@/lib/contexts/AuthContext'
import { useLang } from '@/lib/contexts/LanguageContext'
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
      
      {user && !authLoading ? <HomeUserPanel /> : <></>}

      <GameList />
    </main>
  )
}
