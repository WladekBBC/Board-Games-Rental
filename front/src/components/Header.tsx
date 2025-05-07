'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { LanguageToggle } from './LanguageToggle'
import { useLang } from '@/contexts/LanguageContext'
import { Perms } from '@/contexts/AuthContext'

/**
 * Header component
 * @returns {React.ReactNode}
 */
export function Header() {
  const { user, signOut, permissions } = useAuth()
  const { language } = useLang()

  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
            {language.appTitle}
          </Link>

          <div className="flex items-center space-x-4">
            <nav className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link href="/profile" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                    {language.profile}
                  </Link>
                  {permissions === Perms.A && (
                    <>
                      <Link href="/admin" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                        {language.manageGame}
                      </Link>
                      <Link href="/admin/users" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                        {language.usersManagement}
                      </Link>
                    </>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    {language.logout}
                  </button>
                </>
              ) : (
                <Link href="/login" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  {language.login}
                </Link>
              )}
            </nav>
            <LanguageToggle />
          </div>
        </div>
      </div>
    </header>
  )
} 