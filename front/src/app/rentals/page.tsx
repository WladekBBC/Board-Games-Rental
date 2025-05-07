'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useRentals } from '@/contexts/RentalsContext'
import { useGames } from '@/contexts/GamesContext'
import { useLang } from '@/contexts/LanguageContext'
import ErrorField from '@/components/Messages/ErrorField'
import SuccessField from '@/components/Messages/SuccessField'
import { Spinner } from '@/components/Messages/Spinner'
import { Perms } from '@/interfaces/perms'

/**
 * Rentals page
 * @returns {React.ReactNode}
 */
export default function RentalsPage() {
  const router = useRouter()
  const { permissions, user, loading: authLoading } = useAuth()
  const { rentals, addRental, updateRental, deleteRental, returnGame, loading: rentalsLoading } = useRentals()
  const { games, loading: gamesLoading } = useGames()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const { language } = useLang()

  /**
   * Redirect to login page if user is not authenticated
   */
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/')
    }
  }, [user, authLoading, router])

  /**
   * Render loading state if data is still loading
   * @returns {React.ReactNode}
   */
  if (authLoading || rentalsLoading || gamesLoading) {
    return (
      <Spinner/>
    )
  }

  /**
   * If user isnt logged, and doesn't have permissions, 
   */
  if (!user || ![Perms.A, Perms.R].includes(permissions)) {
    return null
  }

  /**
   * Handle adding a new rental
   * @param {React.FormEvent<HTMLFormElement>} e - Form event
   */
  const handleAddRental = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsProcessing(true)
    setError(null)
    setSuccess(null)

    try {
      const form = e.currentTarget
      if (!form) return

      const formData = new FormData(form)
      const personId = `${formData.get('personId')?.toString()}`
      const gameId:number = +`${formData.get('gameId')?.toString()}`

      const game = games.find(g => g.id === gameId)
      if (!game) {
        throw new Error(language.gameNotFound)
      }

      const activeRentalsCount = rentals.filter(r => 
        r.gameId === gameId && !r.returnedAt
      ).length

      if (activeRentalsCount >= game.quantity) {
        throw new Error(language.gameUnavailableMessage)
      }

      await addRental({
        personId,
        gameId
      })

      form.reset()
      setSuccess(language.gameRented)
    } catch (error) {
      console.error(`${language.rentGameError}: `, error)
      setError(error instanceof Error ? error.message : language.rentGameError)
    } finally {
      setIsProcessing(false)
    }
  }

  /**
   * Handle updating a rental
   * @param {string} id - Rental ID
   * @param {React.FormEvent<HTMLFormElement>} e - Form event
   */
  const handleUpdateRental = async (id: number, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsProcessing(true)
    setError(null)
    setSuccess(null)

    try {
      const form = e.currentTarget
      if (!form) return

      const formData = new FormData(form)
      const personId = `${formData.get('personId')?.toString()}`
      const gameId:number = +`${formData.get('gameId')?.toString()}`

      await updateRental(id, {
        personId,
        gameId
      })
      setSuccess(language.gameRerented)
    } catch (error) {
      console.error(`${language.rerentGameError}: `, error)
      setError(error instanceof Error ? error.message : language.rerentGameError)
    } finally {
      setIsProcessing(false)
    }
  }

  /**
   * Handle deleting a rental
   * @param {string} id - Rental ID
   */
  const handleDeleteRental = async (id: number) => {
    setIsProcessing(true)
    setError(null)
    setSuccess(null)

    try {
      await deleteRental(id)
      setSuccess(language.gameDeletedRent)
    } catch (error) {
      console.error(`${language.deleteGameRentError}: `, error)
      setError(error instanceof Error ? error.message : language.deleteGameRentError)
    } finally {
      setIsProcessing(false)
    }
  }

  /**
   * Handle returning a game
   * @param {string} id - Rental ID
   */
  const handleReturnGame = async (id: number) => {
    setIsProcessing(true)
    setError(null)
    setSuccess(null)

    try {
      await returnGame(id)
      setSuccess(language.gameReturned)
    } catch (error) {
      console.error(`${language.returnGameError}: `, error)
      setError(error instanceof Error ? error.message : language.returnGameError)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{language.manageRent}</h1>

      <ErrorField error={error}/>

      <SuccessField success={success}/>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">{language.addRent}</h2>
        <form onSubmit={handleAddRental} className="space-y-4">
          <div className="w-full">
            <label htmlFor="personId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {language.indexNumber}
            </label>
            <input
              type="text"
              id="personId"
              name="personId"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white px-4 py-2"
              placeholder={language.indexNumber}
            />
          </div>
          <div className="w-full">
            <label htmlFor="gameId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {language.gameId}
            </label>
            <select
              id="gameId"
              name="gameId"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white px-4 py-2"
            >
              <option value="">{language.selectGame}</option>
              {games.map(game => {
                const activeRentalsCount = rentals.filter(r => 
                  r.gameId === game.id && !r.returnedAt
                ).length
                const availableQuantity = game.quantity - activeRentalsCount
                return (
                  <option 
                    key={game.id} 
                    value={game.id}
                    disabled={availableQuantity <= 0}
                  >
                    {game.title} {availableQuantity <= 0 ? language.gameUnavailable : `(${language.gameAvailable}: ${availableQuantity} ${language.piece}.)`}
                  </option>
                )
              })}
            </select>
          </div>
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isProcessing ? language.gameAdding : language.renting}
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {language.indexNumber}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {language.gameTitle}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {language.rentDate}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {language.returnDate}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {language.actions}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {rentals.map(rental => (
              <tr key={rental.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {rental.personId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {games.find(g => g.id === rental.gameId)?.title || 'Невідома гра'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {new Date(rental.rentedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {rental.returnedAt ? new Date(rental.returnedAt).toLocaleDateString() : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {!rental.returnedAt && (
                    <button
                      onClick={() => handleReturnGame(rental.id)}
                      disabled={isProcessing}
                      className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-4 disabled:opacity-50"
                    >
                      {language.return}
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteRental(rental.id)}
                    disabled={isProcessing}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                  >
                    {language.deleteGame}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 