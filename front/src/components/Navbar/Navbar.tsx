'use client'

import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext'
import { useLang } from '@/contexts/LanguageContext'
import { RouterLink } from './RouterLink'
import { UserButton } from './UserButton'
import { useAuth } from '@/contexts/AuthContext'
import { Perms } from '@/interfaces/perms'
import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { MobileNav } from './MobileNavbar'
import { UiNavElements } from './UiNavElements'

/**
 * Navigation bar component that displays the main navigation links and user controls
 * @returns {JSX.Element} The navigation bar with links and controls
 */
export function Navbar() {
  const { user, permissions } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { currentLang, setLanguage, language } = useLang()

  return (
    <Disclosure as="nav" className="bg-white dark:bg-gray-800 light:bg-white sticky top-0 z-50">
      {({ open, close }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 min-[950px]:px-6 lg:px-8 w-full">
            <div className="relative flex h-16 items-center justify-between w-full">
              {/* Mobile menu button */}
              <div className="absolute inset-y-0 left-0 flex items-center min-[950px]:hidden">
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-min-[950px] p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>

              {/* Logo and desktop navigation */}
              <div className="flex flex-1 items-center justify-center min-[950px]:items-stretch min-[950px]:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <Link href="/" className="text-xl font-bold text-grey dark:text-white-800 transition-colors">
                    Board Game Rental
                  </Link>
                </div>
                <div className="hidden min-[950px]:ml-6 min-[950px]:block">
                  <div className="flex space-x-4">
                    {user && (
                      <>
                        <RouterLink link='/' text={language.home} />
                        {[Perms.R, Perms.A].includes(permissions) && <RouterLink link='/rentals' text={language.rentals}/>}
                        {permissions == Perms.A && <RouterLink link='/games' text={language.games} />}
                        {permissions == Perms.A && <RouterLink link='/users' text={language.users} />}
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className='absolute inset-y-0 right-0 flex items-center'>
                <UiNavElements/>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <MobileNav onLinkClick={close} />
        </>
      )}
    </Disclosure>
  )
} 