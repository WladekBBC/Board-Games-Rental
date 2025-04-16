'use client'

import { useState } from 'react'
import { AdminProtected } from '@/components/AdminProtected'
import { AddGameForm } from '@/components/AddGameForm'
import { EditGameForm } from '@/components/EditGameForm'
import { Header } from '@/components/Header'
import { useGames, Game } from '@/lib/contexts/GamesContext'
import Image from 'next/image'

export default function AdminPage() {
  const { games, updateGame } = useGames()
  const [editingGame, setEditingGame] = useState<Game | null>(null)

  const handleUpdateQuantity = (game: Game, newQuantity: number) => {
    if (newQuantity >= 0) {
      updateGame(game.id, {
        ...game,
        quantity: newQuantity,
        isAvailable: newQuantity > 0
      })
    }
  }

  return (
    <AdminProtected>
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Управління іграми</h1>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Додати нову гру</h2>
            <AddGameForm />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Список ігор</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map(game => (
                <div key={game.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md overflow-hidden">
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
                    <div className="mt-4 flex items-center space-x-4">
                      <label className="text-sm text-gray-600 dark:text-gray-300">
                        Кількість штук:
                      </label>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleUpdateQuantity(game, game.quantity - 1)}
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
                        >
                          -
                        </button>
                        <span className="text-sm font-medium text-gray-900 dark:text-white min-w-[2rem] text-center">
                          {game.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(game, game.quantity + 1)}
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end space-x-2">
                      <button
                        onClick={() => setEditingGame(game)}
                        className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
                      >
                        Редагувати
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {editingGame && (
          <EditGameForm
            game={editingGame}
            onClose={() => setEditingGame(null)}
          />
        )}
      </main>
    </AdminProtected>
  )
} 