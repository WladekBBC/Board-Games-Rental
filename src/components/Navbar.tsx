'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/contexts/AuthContext'
import { useTheme } from '@/lib/contexts/ThemeContext'
import { useLang } from '@/lib/contexts/LanguageContext'
import { LanguageToggle } from './LanguageToggle'
import { ThemeToggle } from './ThemeToggle'

/**
 * Navigation bar component that displays the main navigation links and user controls
 * @returns {JSX.Element} The navigation bar with links and controls
 */
export function Navbar() {
  const { user, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { currentLang, setLanguage, language } = useLang()
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  /**
   * Handles user logout
   * @returns {Promise<void>}
   */
  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (!user) return null

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-800 dark:text-white">
                Board Game Rental
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/')
                    ? 'border-blue-500 text-gray-900 dark:text-white'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {language.home}
              </Link>
              <Link
                href="/games"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/games')
                    ? 'border-blue-500 text-gray-900 dark:text-white'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {language.games}
              </Link>
              {user.isAdmin && (
                <Link
                  href="/rentals"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive('/rentals')
                      ? 'border-blue-500 text-gray-900 dark:text-white'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  {language.rentals}
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setLanguage(currentLang === 'pl' ? 'ua' : 'pl')}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {currentLang === 'pl' ? 'UA' : 'PL'}
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {theme === 'dark' ? '🌞' : '🌙'}
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {user.email}
              </span>
              <button
                onClick={handleSignOut}
                className="text-sm text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
              >
                {language.logout}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
} 