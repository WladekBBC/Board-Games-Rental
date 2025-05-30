'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useGames } from '@/contexts/GamesContext'
import { useLang } from '@/contexts/LanguageContext'
import { SingleGame } from '@/components/Game/SingleGame'
import { useAuth } from '@/contexts/AuthContext'
import { Perms } from '@/interfaces/perms'
import { SearchBar } from '@/components/SearchBar'
import { GameForm } from '@/components/Game/GameForm'
import { chechCookie } from '../actions'
import { Spinner } from '@/components/Messages/Spinner'

export default function GamesPage() {
  const router = useRouter()
  const { permissions, user, loading } = useAuth()
  const {
      loading: gamesLoading, 
      searchType,
      setSearchType,
      searchQuery,
      setSearchQuery,
      SearchedGames
      } = useGames()
  const { language } = useLang()

  useEffect(() => {
    chechCookie('Authorization').then((res) => {if (!res) router.push("/")})
  }, [user])

  if (loading || gamesLoading) {
    return (
      <Spinner/>
    )
  }

  if((!loading || !gamesLoading) && permissions == Perms.A)
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{language.manageGame}</h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">{language.addNewGame}</h2>
          <GameForm/>
        </div>
        <SearchBar
          options={[
            { value: 'title', label: language.searchByTitle },
            { value: 'category', label: language.searchByCategory }
          ]}
          value={searchQuery}
          onValueChange={setSearchQuery}
          selected={searchType}
          onSelectChange={val => setSearchType(val as typeof searchType)}
          placeholder={searchType === 'title' ? language.searchByTitle : language.searchByCategory}
          className="mb-4"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SearchedGames.map(game => (
            <SingleGame game={game} actions={true} key={game.id}/>
          ))}
        </div>
      </div>
    )
  return null
} 