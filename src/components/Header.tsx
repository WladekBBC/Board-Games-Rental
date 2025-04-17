'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/contexts/AuthContext'
import ThemeToggle from './ThemeToggle'
import LanguageToggle from './LanguageToggle'
import { useLang } from '@/lib/contexts/LanguageContext'

export function Header() {
  const pathname = usePathname()
  const { user, signOut, loading, isAdmin } = useAuth()
  const { language } = useLang()

  const isActive = (path: string) => pathname === path

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
            {language.appTitle}
          </Link>
          <nav className="flex items-center space-x-4">
            <LanguageToggle />
            <ThemeToggle />
            {!loading && (
              <>
                {user ? (
                  <>
                    <Link
                      href="/games"
                      className={`text-sm ${
                        isActive('/games')
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      {language.games}
                    </Link>
                    <Link
                      href={isAdmin ? "/rentals" : "/my-rentals"}
                      className={`text-sm ${
                        isActive('/rentals') || isActive('/my-rentals')
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      {language.rentals}
                    </Link>
                    <Link
                      href="/profile"
                      className={`text-sm ${
                        isActive('/profile')
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      {language.profile}
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    >
                      {language.logout}
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    Login
                  </Link>
                )}
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
} 