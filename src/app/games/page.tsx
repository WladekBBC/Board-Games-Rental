'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/contexts/AuthContext'
import { useGames, Game } from '@/lib/contexts/GamesContext'
import { EditGameForm } from '@/components/EditGameForm'
import Image from 'next/image'
import { useLang } from '@/lib/contexts/LanguageContext'

export default function GamesPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { games, addGame, updateGame, deleteGame, loading: gamesLoading } = useGames()
  const [isProcessing, setIsProcessing] = useState(false)
  const [editingGame, setEditingGame] = useState<Game | null>(null)
  const { language } = useLang()

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login')
    }
  }, [user, authLoading, router])

  if (authLoading || gamesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleAddGame = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      const formData = new FormData(e.currentTarget)
      const title = formData.get('title') as string
      const description = formData.get('description') as string
      const imageUrl = formData.get('imageUrl') as string
      const category = formData.get('category') as string
      const quantity = parseInt(formData.get('quantity') as string) || 0

      await addGame({
        title,
        description,
        imageUrl,
        category,
        quantity,
        isAvailable: quantity > 0
      })

      e.currentTarget.reset()
    } catch (error) {
      console.error(`${language.addGameError}: `, error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleUpdateGame = async (id: string, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      const formData = new FormData(e.currentTarget)
      const title = formData.get('title') as string
      const description = formData.get('description') as string
      const imageUrl = formData.get('imageUrl') as string
      const category = formData.get('category') as string
      const isAvailable = formData.get('isAvailable') === 'true'

      await updateGame(id, {
        title,
        description,
        imageUrl,
        category,
        isAvailable
      })
    } catch (error) {
      console.error(`${language.editGameError}: `, error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDeleteGame = async (id: string) => {
    setIsProcessing(true)

    try {
      await deleteGame(id)
    } catch (error) {
      console.error(`${language.deleteGameError}: `, error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{language.manageGame}</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">{language.addNewGame}</h2>
        <form onSubmit={handleAddGame} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {language.gameTitle}
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {language.gameDesc}
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {language.gameImageUrl}
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {language.gameCategory}
            </label>
            <input
              type="text"
              id="category"
              name="category"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {language.gameNumber}
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="0"
              required
              defaultValue="1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isProcessing ? language.gameAdding : language.addGame}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map(game => (
          <div key={game.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <Image src={game.imageUrl} alt={game.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{game.title}</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{game.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">{game.category}</span>
                <span className={`text-sm ${game.isAvailable ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {game.isAvailable ? 'Доступна' : 'Недоступна'}
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {language.gameNumber}: {game.quantity}
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => setEditingGame(game)}
                  className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
                >
                  {language.editGame}
                </button>
                <button
                  onClick={() => handleDeleteGame(game.id)}
                  disabled={isProcessing}
                  className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 disabled:opacity-50"
                >
                  {language.deleteGame}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingGame && (
        <EditGameForm
          game={editingGame}
          onClose={() => setEditingGame(null)}
        />
      )}
    </div>
  )
} 