'use client'

import { useGames } from '@/contexts/GamesContext'
import { useLang } from '@/contexts/LanguageContext'
import { SingleGame } from '@/components/Game/SingleGame'
import { useAuth } from '@/contexts/AuthContext'
import { Perms } from '@/interfaces/perms'
import { SearchBar } from '@/components/SearchBar'
import { GameForm } from '@/components/Game/GameForm'
import { Spinner } from '@/components/Messages/Spinner'
import { useLoading } from '@/contexts/LoadingContext'

export default function GamesPage() {
  const { searchType, searchQuery, SearchedGames, setSearchType, setSearchQuery } = useGames()
  const { permissions } = useAuth()
  const { language } = useLang()
  const { loading } = useLoading()

  if(!loading && permissions == Perms.A)
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
  return <Spinner/>
} 