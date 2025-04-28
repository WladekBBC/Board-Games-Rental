'use client'

import Image, { ImageLoaderProps } from 'next/image'
import { useState } from 'react'
import { Game, useGames } from '@/lib/contexts/GamesContext'
import { useAuth } from '@/lib/contexts/AuthContext'
import { EditGameForm } from './EditGameForm'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '@/lib/contexts/LanguageContext'


interface BoardGameListProps {
  games: Game[]
  isAdmin: boolean
  onEdit: (game: Game) => void
  onDelete: (id: string) => void
}

const imageLoader = ({ src, width, quality = 75 }: ImageLoaderProps): string => {
  return `${src}?w=${width}&q=${quality}`
}

/**
 * BoardGameList component
 * @param {Object} props - Component props
 * @param {Game[]} props.games - Array of games to display
 * @param {boolean} props.isAdmin - Whether the user is an admin
 * @param {(game: Game) => void} props.onEdit - Function to handle game edit
 * @param {(id: string) => void} props.onDelete - Function to handle game deletion
 */
export function BoardGameList({ games, isAdmin, onEdit, onDelete }: BoardGameListProps) {
  const { language } = useLang()
  const { deleteGame } = useGames()
  const [editingGame, setEditingGame] = useState<Game | null>(null)
  const [deletingGame, setDeletingGame] = useState<Game | null>(null)

  /**
   * Handles game edit click
   * @param {Game} game - Game to edit
   */
  const handleEdit = (game: Game) => {
    setEditingGame(game)
  }

  /**
   * Handles game deletion click
   * @param {string} id - ID game to delete
   */
  const handleDelete = (id: string) => {
    if (window.confirm(language.confirmDelete)) {
      onDelete(id)
    }
  }

  const confirmDelete = async () => {
    if (deletingGame) {
      try {
        await deleteGame(deletingGame.id)
        setDeletingGame(null)
      } catch (error) {
        console.error('Error deleting game:', error)
      }
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
          >
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
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{game.title}</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-300">{game.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-medium text-gray-900 dark:text-white">
                  В наявності: {game.quantity} шт.
                </span>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  game.isAvailable 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {game.isAvailable ? language.gameAvailable : language.gameUnavailable}
                </span>
              </div>
              {isAdmin && (
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => handleEdit(game)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {language.editGame}
                  </button>
                  <button
                    onClick={() => handleDelete(game.id)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    {language.deleteGame}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {editingGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <EditGameForm
                game={editingGame}
                onClose={() => setEditingGame(null)}
              />
            </motion.div>
          </motion.div>
        )}

        {deletingGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full"
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Підтвердження видалення</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Ви впевнені, що хочете видалити гру {deletingGame.title}?
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Видалити
                </button>
                <button
                  onClick={() => setDeletingGame(null)}
                  className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-2 px-4 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Скасувати
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 