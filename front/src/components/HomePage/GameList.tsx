'use client'

import { useGames } from '@/contexts/GamesContext'
import { useRentals } from '@/contexts/RentalsContext'
import { useLang } from '@/contexts/LanguageContext'
import { SingleGame } from '../Game/SingleGame'

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
        const rentedCount = rentals.filter(r => r.game.id === game.id && !r.returnedAt).length
        return {
            ...game,
        }
    })

    return (
        <><h2 className="text-2xl font-bold mb-6">{language.gameList}</h2><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gamesWithAvailability.map(game => (
                <SingleGame game={game} key={game.id}/>
            ))}
        </div></>
    )
}
