'use client'

import { useGames } from '@/contexts/GamesContext'
import { useLang } from '@/contexts/LanguageContext'
import { SingleGame } from '../Game/SingleGame'
import { SearchType } from '@/types/gameContext'
import { useState } from 'react'
import { SearchBar } from '../SearchBar'
import { Spinner } from '../Messages/Spinner'
/**
 * Home page
 * @returns {React.ReactNode}
 */
export default function GameList(){

    const { games, loading } = useGames()
    const { language } = useLang()
    const [searchType, setSearchType] = useState<SearchType>('title')
    const [searchQuery, setSearchQuery] = useState('')

    /**
     * Search for games by title or category
     * @param {Game[]} games - List of games
     * @returns {Game[]} List of games with availability
     **/
    const SearchedGames = [...games]
        .filter(game => {
            if (!searchQuery) return true;
            
        const searchLower = searchQuery.toLowerCase();
           
        switch (searchType) {
            case 'title':
            return game.title.toLowerCase().includes(searchLower)
            case 'category':
            return game.category.toLowerCase().includes(searchLower)
        }
    })

    return (
        <>
        <SearchBar
          options={[
            { value: 'title', label: language.searchByTitle },
            { value: 'category', label: language.searchByCategory }
          ]}
          value={searchQuery}
          onValueChange={setSearchQuery}
          selected={searchType}
          onSelectChange={val => setSearchType(val as SearchType)}
          placeholder={searchType === 'title' ? language.searchByTitle : language.searchByCategory}
          className="mb-4"
        />
        <h2 className="text-2xl font-bold mb-6">{language.gameList}</h2>
        {loading ? 
            <Spinner full={false}/> : 
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SearchedGames.map(game => (
                    <SingleGame game={game} key={game.id}/>
                ))}
            </div>
        }
        </>
    )
}
