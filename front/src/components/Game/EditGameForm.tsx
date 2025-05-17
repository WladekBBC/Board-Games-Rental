'use client'
import { IGame } from '@/interfaces/game'
import { useLang } from '@/contexts/LanguageContext'
import { GameForm } from './GameForm'

interface EditGameFormProps {
  game: IGame
  onClose: () => void
}

/**
 * Formularz edycji istniejącej gry
 * @param {Object} props - Właściwości komponentu
 * @param {IGame} props.game - Gra do edycji
 * @param {() => void} props.onClose - Funkcja zamykająca formularz
 * @returns {JSX.Element} Komponent formularza
 */
export function EditGameForm({ game, onClose }: EditGameFormProps) {
  const { language } = useLang()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
    style={{ zIndex: 1000 }}>
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
        
        <GameForm game={game} onClose={onClose}/>
      </div>
    </div>
  )
} 