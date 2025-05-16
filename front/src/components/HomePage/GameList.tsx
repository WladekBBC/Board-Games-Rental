'use client'

import { useGames } from '@/contexts/GamesContext'
import { useRentals } from '@/contexts/RentalsContext'
import { useLang } from '@/contexts/LanguageContext'
import { SingleGame } from '../Game/SingleGame'
import { SearchType } from '@/types/gameContext'
import { useState } from 'react'
/**
 * Home page
 * @returns {React.ReactNode}
 */
export default function GameList(){

    const { games } = useGames()
    const { rentals } = useRentals()
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
        <div className="flex gap-4 mb-4">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as 'title' | 'category' )}
              className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="title">{language.searchByTitle}</option>
              <option value="category">{language.searchByCategory}</option>
            </select>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                searchType === 'title' ? language.searchByTitle : language.searchByCategory 
              }
              className="flex-1 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        <h2 className="text-2xl font-bold mb-6">{language.gameList}</h2><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SearchedGames.map(game => (
                <SingleGame game={game} key={game.id}/>
            ))}
        </div></>
    )
}
