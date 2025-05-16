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
import { Rent } from '@/types/rentalContext'
import { AdminProtected } from '@/components/AdminProtected'

/**
 * Rentals page
 * @returns {React.ReactNode}
 */
export default function RentalsPage() {
  const router = useRouter()
  const { permissions, user, loading: authLoading } = useAuth()
  const { 
    rentals, 
    addRental, 
    returnGame, 
    removeRental, 
    loading: rentalsLoading,
    sortConfig,
    setSortConfig,
    searchQuery,
    setSearchQuery,
    searchType,
    setSearchType,
    filteredAndSortedRentals
  } = useRentals()
  const { games, loading: gamesLoading } = useGames()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const { language } = useLang()

  const handleSort = (key: 'rentedAt' | 'title' | 'index') => {
    if (sortConfig.key === key) {
      setSortConfig({
        key,
        direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'
      });
    } else {
      setSortConfig({
        key,
        direction: 'asc'
      });
    }
  };

  const handleSuccess = (successMessage: string) =>{
    setSuccess(successMessage);
    setTimeout(() => setSuccess(null), 3000);
  }
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

  const resetFields = () =>{
    setIsProcessing(true)
    setError(null)
    setSuccess(null)
  }

  /**
   * Handle adding a new rental
   * @param {React.FormEvent<HTMLFormElement>} e - Form event
   */
  const handleAddRental = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    resetFields()
    
    const form = new FormData(e.currentTarget)
    if (!form) return

    const idPersonRegex = /^(?:\d{6}|SD\d{4}|\+?[0-9]{7,15})$/;
    if (!idPersonRegex.test(form.get('personId') as string)) {
      setError(language.invalidAlbumNumberFormat);
      setIsProcessing(false);
      return;
    }

    const game = games.find((el)=> el.id == +`${form.get('gameId')}`)
    if (!game) return

    const data: Rent = {
      index:  `${form.get('personId')}`,
      game: game,
      rentedAt: new Date(Date.now())
    }

    addRental(data).then(()=>{
      handleSuccess(language.gameRented)
    }).catch((err: Error)=>{
      console.log(err)
      setError(err.cause == 406 ? language.rentGameError : language.serverError)
    })
      
    setIsProcessing(false)
  }

  /**
   * Handle returning a game
   * @param {string} id - Rental ID
   */
  const handleReturnGame = async (id: number) => {
    resetFields()

    returnGame(id).then(()=>{
      handleSuccess(language.gameReturned)
    }).catch((err: Error)=>{
      setError(err.cause == 406 ? language.returnGameError : language.fetchError)
    })

    setIsProcessing(false)
  }

  const handleDeleteRental = async (id: number) => {
    resetFields()

    removeRental(id).then(()=>{
      handleSuccess(language.deletedGame)
    }).catch((err: Error)=>{
      setError(err.cause == 406 ? language.deleteGameError : language.serverError)
    })
    setIsProcessing(false)
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
                return (
                  <option 
                    key={game.id} 
                    value={game.id}
                    disabled={game.quantity <= 0}
                  >
                    {game.title} {game.quantity <= 0 ? language.gameUnavailable : `(${language.gameAvailable}: ${game.quantity} ${language.piece}.)`}
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
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-4 mb-4">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as 'index' | 'title' | 'date')}
              className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="index">{language.searchByIndex}</option>
              <option value="title">{language.searchByTitle}</option>
              <option value="date">{language.searchByDate}</option>
            </select>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                searchType === 'index' ? language.searchByIndex :
                searchType === 'title' ? language.searchByTitle :
                language.searchByDate
              }
              className="flex-1 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('index')}
              >
                {language.indexNumber} {sortConfig.key === 'index' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('title')}
              >
                {language.gameTitle} {sortConfig.key === 'title' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('rentedAt')}
              >
                {language.rentDate} {sortConfig.key === 'rentedAt' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
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
            {filteredAndSortedRentals.map(rental => (
              <tr key={rental.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {rental.index}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {games.find(g => g.id === rental.game.id)?.title || language.unknownGame}
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

                  {permissions.includes(Perms.A) && (<button
                    onClick={() => handleDeleteRental(rental.id)}
                    disabled={isProcessing}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                  >
                      {language.deleteGame}
                    </button>)}
                    
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 