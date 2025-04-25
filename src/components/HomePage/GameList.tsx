'use client'

import { useGames } from '@/lib/contexts/GamesContext'
import { useRentals } from '@/lib/contexts/RentalsContext'
import Image from 'next/image'
import { useLang } from '@/lib/contexts/LanguageContext'
import { imageLoader } from '@/lib/utils/imageLoader'

/**
 * Home page
 * @returns {React.ReactNode}
 */
export default function GameList(){

    const { games } = useGames()
    const { rentals } = useRentals()
    const { language } = useLang()

    /**
     * Calculate available copies for each game
     * @param {Game[]} games - List of games
     * @returns {Game[]} List of games with availability
     **/
    const gamesWithAvailability = games.map(game => {
        const rentedCount = rentals.filter(r => r.gameId === game.id && !r.returnedAt).length
        const availableQuantity = game.quantity - rentedCount
        return {
        ...game,
        availableQuantity
        }
    })

    return (
        <><h2 className="text-2xl font-bold mb-6">{language.gameList}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gamesWithAvailability.map(game => (
                <div key={game.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                    <div className="relative h-48">
                        <Image
                            loader={imageLoader}
                            src={game.imageUrl}
                            alt={game.title}
                            width={800}
                            height={400}
                            className="object-cover w-full h-full" />
                    </div>
                    <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{game.title}</h3>
                        <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">{game.description}</div>
                        <div className="mt-4 flex items-center justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">{game.category}</span>
                            <div className="flex flex-col items-end">
                                <span className={`text-sm ${game.availableQuantity > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {game.availableQuantity > 0 ? language.gameAvailable : language.gameUnavailable} 
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {language.available}: {game.availableQuantity} / {game.quantity} {language.qt}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        </>
    )
}
