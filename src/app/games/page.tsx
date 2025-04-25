'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/contexts/AuthContext'
import { useGames, Game } from '@/lib/contexts/GamesContext'
import { EditGameForm } from '@/components/EditGameForm'
import { useLang } from '@/lib/contexts/LanguageContext'
import { BoardGameList } from '@/components/BoardGameList'

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

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{language.gameList}</h2>
        <BoardGameList
          games={games}
          isAdmin={user.isAdmin}
          onEdit={setEditingGame}
          onDelete={handleDeleteGame}
        />
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