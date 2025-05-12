'use client'

import { useLang } from '@/contexts/LanguageContext'
import { Language } from '@/lib/i18n/translations'

/**
 * Component for toggling between different languages
 * @returns {JSX.Element} A button that toggles the application language
 */
export function LanguageToggle() {
  const { currentLang, setLanguage } = useLang()

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => setLanguage('pl')}
        className={`px-2 py-1 rounded ${
          currentLang === 'pl'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
        }`}
      >
        PL
      </button>
      <button
        onClick={() => setLanguage('ua')}
        className={`px-2 py-1 rounded ${
          currentLang === 'ua'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
        }`}
      >
        UA
      </button>
    </div>
  )
} 