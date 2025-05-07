'use client'

import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext'
import { useLang } from '@/contexts/LanguageContext'
import { RouterLink } from './RouterLink'
import { UserButton } from './UserButton'
import { useAuth } from '@/contexts/AuthContext'
import { Perms } from '@/interfaces/perms'

/**
 * Navigation bar component that displays the main navigation links and user controls
 * @returns {JSX.Element} The navigation bar with links and controls
 */
export function Navbar() {
  const { user, permissions } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { currentLang, setLanguage, language } = useLang()

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
              {user && 
              <>
                <RouterLink link='/' text={language.home} />
                {[Perms.R, Perms.A].includes(permissions) && <RouterLink link='/rentals' text={language.rentals}/>}
                {permissions == Perms.A && <RouterLink link='/games' text={language.games} />}
                {permissions == Perms.A && <RouterLink link='/users' text={language.users} />}
              </>
              }
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
              {user ? <UserButton /> : <RouterLink link='/login' text={language.login}/>
            }
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
} 