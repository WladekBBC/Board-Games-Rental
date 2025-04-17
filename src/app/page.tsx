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

  // Obliczamy dostępne egzemplarze dla każdej gry
  const gamesWithAvailability = games.map(game => {
    const rentedCount = rentals.filter(r => r.gameId === game.id && !r.returnedAt).length
    const availableQuantity = game.quantity - rentedCount
    return {
      ...game,
      availableQuantity
    }
  })

  // Obliczamy statystyki dla kart informacyjnych
  const availableGames = gamesWithAvailability.filter(game => game.availableQuantity > 0)
  const totalAvailableCopies = gamesWithAvailability.reduce((total, game) => total + game.availableQuantity, 0)

  // Obliczamy aktywne wypożyczenia
  const activeRentals = rentals.filter(rental => !rental.returnedAt)
  const userActiveRentals = activeRentals.filter(rental => rental.personId === user.email)

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Ласкаво просимо до системи оренди настільних ігор</h1>
      
      {/* Інформаційні картки */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Link href="/games" className="block">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">Ігри</h2>
            <div className="text-gray-600 dark:text-gray-300">
              Доступно {availableGames.length} унікальних ігор
              <br />
              Всього {totalAvailableCopies} вільних екземплярів
            </div>
          </div>
        </Link>
        <Link href={user.isAdmin ? "/rentals" : "/my-rentals"} className="block">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4">Оренда</h2>
            <div className="text-gray-600 dark:text-gray-300 mb-2">
              {user.isAdmin
                ? 'Управління орендами та перегляд історії.'
                : 'Перегляньте свої поточні оренди та історію.'}
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-400">
              {user.isAdmin 
                ? `Активних оренд: ${activeRentals.length}`
                : `Ваших активних оренд: ${userActiveRentals.length}`}
            </div>
          </div>
        </Link>
        <Link href="/profile" className="block">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4">Профіль</h2>
            <div className="text-gray-600 dark:text-gray-300 mb-2">
              {user.isAdmin
                ? 'Управління системою та налаштування.'
                : 'Ваші налаштування та персональна інформація.'}
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-400">
              {user.email}
            </div>
          </div>
        </Link>
      </div>

      {/* Список доступних ігор */}
      <h2 className="text-2xl font-bold mb-6">Доступні ігри</h2>
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
                    {game.availableQuantity > 0 ? 'Доступна' : 'Недоступна'}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Available: {game.availableQuantity} з {game.quantity} шт.
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
