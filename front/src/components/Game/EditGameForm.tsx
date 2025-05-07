'use client'

import { useState } from 'react'
import { useGames, Game } from '@/contexts/GamesContext'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { imageLoader } from '@/lib/utils/imageLoader'
import { useLang } from '@/contexts/LanguageContext'

const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB

interface EditGameFormProps {
  game: Game
  onClose: () => void
}

/**
 * Formularz edycji istniejącej gry
 * @param {Object} props - Właściwości komponentu
 * @param {Game} props.game - Gra do edycji
 * @param {() => void} props.onClose - Funkcja zamykająca formularz
 * @returns {JSX.Element} Komponent formularza
 */
export function EditGameForm({ game, onClose }: EditGameFormProps) {
  const { updateGame } = useGames()
  const { language } = useLang()
  const [formData, setFormData] = useState({
    title: game.title,
    description: game.description,
    imageUrl: game.imageUrl,
    quantity: game.quantity,
    category: game.category,
  })
  const [error, setError] = useState<string | null>(null)
  const [isImageValid, setIsImageValid] = useState(true)
  const [isValidating, setIsValidating] = useState(false)

  /**
   * Image size and URL validation
   * @param {string} url - URL img to validate
   * @returns {Promise<boolean>} Whether the image is valid
   */
  const validateImageUrl = async (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = document.createElement('img')
      img.onload = async () => {
        try {
          const response = await fetch(url)
          const blob = await response.blob()
          if (blob.size > MAX_IMAGE_SIZE) {
            resolve(false)
            setError(language.invalidImageUrl)
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

  /**
   * Handles form submission
   * @param {React.FormEvent} e - Event form
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.title.trim()) {
      setError(language.enterTitle)
      return
    }

    if (!formData.description || !formData.description.trim()) {
      setError(language.enterDesc)
      return
    }

    if (!formData.imageUrl.trim()) {
      setError(language.enterImageUrl)
      return
    }

    setIsValidating(true)
    const isValid = await validateImageUrl(formData.imageUrl)
    setIsValidating(false)
    
    if (!isValid) {
      setError(language.invalidImageUrl)
      setIsImageValid(false)
      return
    }

    if (formData.quantity < 0) {
      setError(language.invalidQuantity)
      return
    }

    updateGame(game.id, formData).then(()=>{
      onClose()
    }).catch(()=>{
      setError(language.editGameError)

    })
  }

  /**
   * Handles img URL change
   * @param {React.ChangeEvent<HTMLInputElement>} e - Event input
   */
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
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{language.editGame}</h2>
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
              {language.gameTitle}
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
              {language.gameDesc}
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
              {language.gameImageUrl}
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
                {language.invalidImageUrl}
              </p>
            )}
            {formData.imageUrl && isImageValid && (
              <div className="mt-2 relative h-48 w-full">
                <Image
                  loader={imageLoader}
                  src={formData.imageUrl}
                  alt="Podgląd obrazu"
                  width={800}
                  height={400}
                  className="object-cover w-full h-full rounded-md"
                />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              {language.gameCategory}
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
              {language.gameNumber}
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

          {isValidating && (
            <p className="text-blue-500">
              {language.validating}
            </p>
          )}

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={isValidating}
              className={`flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isValidating ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {language.save}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              {language.cancel}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 