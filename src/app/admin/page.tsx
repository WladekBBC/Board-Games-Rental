'use client'

import { useState } from 'react'
import { AdminProtected } from '@/components/AdminProtected'
import { AddGameForm } from '@/components/AddGameForm'
import { EditGameForm } from '@/components/EditGameForm'
import { Header } from '@/components/Header'
import { useGames, Game } from '@/lib/contexts/GamesContext'
import Image from 'next/image'
import { useLang } from '@/lib/contexts/LanguageContext'
import { imageLoader } from '@/lib/utils/imageLoader'
import { BoardGameList } from '@/components/BoardGameList'

export default function AdminPage() {
  const { games, updateGame } = useGames()
  const [editingGame, setEditingGame] = useState<Game | null>(null)
  const { language } = useLang()

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">{language.manageGame}</h1>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{language.addNewGame}</h2>
            <AddGameForm onClose={() => {}} />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{language.gameList}</h2>
            <BoardGameList
              games={games}
              isAdmin={true}
              onEdit={setEditingGame}
              onDelete={(id) => {
                const game = games.find(g => g.id === id)
                if (game) {
                  updateGame(id, { ...game, quantity: 0, isAvailable: false })
                }
              }}
            />
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