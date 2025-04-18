'use client'

import { useAuth } from '@/lib/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { useGames } from '@/lib/contexts/GamesContext'
import { useRentals } from '@/lib/contexts/RentalsContext'
import Image from 'next/image'
import { useLang } from '@/lib/contexts/LanguageContext'
import { imageLoader } from '@/lib/utils/imageLoader'

/**
 * Home page
 * @returns {React.ReactNode}
 */
export default function Home() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { games } = useGames()
  const { rentals } = useRentals()
  const { language } = useLang()


  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login')
    }
  }, [user, authLoading, router])

  if (authLoading || !user) {
    return null
  }

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
  const userActiveRentals = activeRentals.filter(rental => rental.personId === user.email)

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{language.appTitle}</h1>
      
      {/* three informating fields on home page */}
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
        <Link href={user.isAdmin ? "/rentals" : "/my-rentals"} className="block h-full">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow h-full flex flex-col">
            <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">{language.rentals}</h2>
            <div className="text-gray-600 dark:text-gray-300 flex-grow">
              {user.isAdmin
                ? language.activeRentals
                : language.yourActiveRentals}
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-400">
              {user.isAdmin 
                ? `${activeRentals.length}`
                : `${userActiveRentals.length}`}
            </div>
          </div>
        </Link>
        <Link href="/profile" className="block h-full">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow h-full flex flex-col">
            <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">{language.profile}</h2>
            <div className="text-gray-600 dark:text-gray-300 flex-grow">
              {user.email}
            </div>
          </div>
        </Link>
      </div>

      {/* List of available games */}
      <h2 className="text-2xl font-bold mb-6">{language.gameList}</h2>
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
                className="object-cover w-full h-full"
              />
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
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {language.available}: {game.availableQuantity} / {game.quantity}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
