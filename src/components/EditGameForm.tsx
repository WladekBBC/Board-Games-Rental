'use client'

import { useState } from 'react'
import { useGames, Game } from '@/lib/contexts/GamesContext'
import { motion } from 'framer-motion'

const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB

interface EditGameFormProps {
  game: Game
  onClose: () => void
}

export function EditGameForm({ game, onClose }: EditGameFormProps) {
  const { updateGame } = useGames()
  const [formData, setFormData] = useState({
    title: game.title,
    description: game.description,
    imageUrl: game.imageUrl,
    quantity: game.quantity,
    category: game.category,
    isAvailable: game.isAvailable
  })
  const [error, setError] = useState<string | null>(null)
  const [isImageValid, setIsImageValid] = useState(true)
  const [isValidating, setIsValidating] = useState(false)

  const validateImageUrl = async (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = async () => {
        try {
          // Перевіряємо розмір зображення
          const response = await fetch(url)
          const blob = await response.blob()
          if (blob.size > MAX_IMAGE_SIZE) {
            resolve(false)
            setError('Розмір зображення не повинен перевищувати 5MB')
            return
          }
          resolve(true)
        } catch (error) {
          resolve(false)
        }
      }
      img.onerror = () => resolve(false)
      img.src = url
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.title.trim()) {
      setError('Будь ласка, введіть назву гри')
      return
    }

    if (!formData.description.trim()) {
      setError('Будь ласка, введіть опис гри')
      return
    }

    if (!formData.imageUrl.trim()) {
      setError('Будь ласка, додайте посилання на зображення')
      return
    }

    setIsValidating(true)
    const isValid = await validateImageUrl(formData.imageUrl)
    setIsValidating(false)
    
    if (!isValid) {
      setError('Неправильне посилання на зображення або розмір перевищує 5MB')
      setIsImageValid(false)
      return
    }

    if (formData.quantity < 0) {
      setError('Кількість не може бути від\'ємною')
      return
    }

    try {
      updateGame(game.id, {
        ...formData,
        isAvailable: formData.quantity > 0
      })
      onClose()
    } catch (error) {
      setError('Помилка при оновленні гри')
    }
  }

  const handleImageUrlChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setFormData(prev => ({ ...prev, imageUrl: url }))
    if (url) {
      setIsValidating(true)
      const isValid = await validateImageUrl(url)
      setIsValidating(false)
      setIsImageValid(isValid)
    } else {
      setIsImageValid(true)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Редагувати гру</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Назва гри
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Опис
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
            />
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
              Посилання на зображення
            </label>
            <div className="relative">
              <input
                type="url"
                id="imageUrl"
                value={formData.imageUrl}
                onChange={handleImageUrlChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 text-gray-900 ${
                  isImageValid 
                    ? 'border-gray-300 focus:border-blue-500' 
                    : 'border-red-300 focus:border-red-500'
                }`}
              />
              {isValidating && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                </motion.div>
              )}
            </div>
            {!isImageValid && (
              <p className="mt-1 text-sm text-red-600">
                Неправильне посилання на зображення або розмір перевищує 5MB
              </p>
            )}
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Категорія
            </label>
            <input
              type="text"
              id="category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
            />
          </div>

          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
              Кількість штук
            </label>
            <input
              type="number"
              id="quantity"
              min="0"
              value={formData.quantity}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                quantity: parseInt(e.target.value) || 0,
                isAvailable: parseInt(e.target.value) > 0
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={isValidating}
              className={`flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isValidating ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isValidating ? 'Перевірка...' : 'Зберегти зміни'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Скасувати
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 