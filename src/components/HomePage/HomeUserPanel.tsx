'use client'

import { useGames } from '@/lib/contexts/GamesContext'
import { useRentals } from '@/lib/contexts/RentalsContext'
import { useLang } from '@/lib/contexts/LanguageContext'
import { useAuth } from '@/lib/contexts/AuthContext'
import Link from 'next/link'

/**
 * Home page
 * @returns {React.ReactNode}
 */
export default function HomeUserPanel(){

    const { user, loading: authLoading } = useAuth()
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

    /** 
     * Calculate available games
     * @param {Game[]} gamesWithAvailability - List of games with availability
     * @returns {Game[]} List of available games
     * @param {number} totalAvailableCopies - Total available copies
     **/
    const availableGames = gamesWithAvailability.filter(game => game.availableQuantity > 0)
    const totalAvailableCopies = gamesWithAvailability.reduce((total, game) => total + game.availableQuantity, 0)

    /** 
     * Calculate active rentals
     * @param {Rental[]} rentals - List of rentals
     * @returns {Rental[]} List of active rentals
     **/
    const activeRentals = rentals.filter(rental => !rental.returnedAt)
    const userActiveRentals = activeRentals.filter(rental => rental.personId === user!.email)

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <Link href="/games" className="block h-full">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow h-full flex flex-col">
                    <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">{language.games}</h2>
                    <div className="text-gray-600 dark:text-gray-300 flex-grow">
                        {language.totalGames}: {availableGames.length}
                        <br />
                        {language.availableCopies}: {totalAvailableCopies}
                    </div>
                    </div>
                </Link>
                <Link href={user!.isAdmin ? "/rentals" : "/my-rentals"} className="block h-full">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow h-full flex flex-col">
                    <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">{language.rentals}</h2>
                    <div className="text-gray-600 dark:text-gray-300 flex-grow">
                        {user!.isAdmin
                        ? language.activeRentals
                        : language.yourActiveRentals}
                    </div>
                    <div className="text-sm text-blue-600 dark:text-blue-400">
                        {user!.isAdmin 
                        ? `${activeRentals.length}`
                        : `${userActiveRentals.length}`}
                    </div>
                    </div>
                </Link>
                <Link href="/profile" className="block h-full">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow h-full flex flex-col">
                    <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">{language.profile}</h2>
                    <div className="text-gray-600 dark:text-gray-300 flex-grow">
                        {user!.email}
                    </div>
                    </div>
                </Link>
            </div>
        </>
    )
}
