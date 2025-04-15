'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/contexts/AuthContext'
import ThemeToggle from './ThemeToggle'

export function Header() {
  const pathname = usePathname()
  const { user, signOut, loading, isAdmin } = useAuth()

  const isActive = (path: string) => pathname === path

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
            Board Game Rental
          </Link>
          <nav className="flex items-center space-x-4">
            <ThemeToggle />
            {!loading && (
              <>
                {user ? (
                  <>
                    {isAdmin && (
                      <>
                        <Link 
                          href="/admin" 
                          className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                          Адмін панель
                        </Link>
                        <Link 
                          href="/rentals" 
                          className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                          Орендовані ігри
                        </Link>
                      </>
                    )}
                    <button
                      onClick={() => signOut()}
                      className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      Вийти ({user.email})
                    </button>
                  </>
                ) : (
                  <Link 
                    href="/login"
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Увійти
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