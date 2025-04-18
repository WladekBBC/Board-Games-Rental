'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { translations, Language } from '../i18n/translations'

/**
 * Language context type
 * @interface LanguageContextType
 */
interface LanguageContextType {
  language: typeof translations.pl | typeof translations.ua
  currentLang: Language
  setLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

/**
 * Language context provider
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Component children
 * @returns {JSX.Element} Language context provider
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLang, setCurrentLang] = useState<Language>('ua')

  /**
   * Initializes language when application starts
   */
  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language
    if (savedLang && (savedLang === 'pl' || savedLang === 'ua')) {
      setCurrentLang(savedLang)
    }
  }, [])

  /**
   * Sets the new language of the application
   * @param {Language} lang - New language ('pl' or 'ua')
   */
  const setLanguage = (lang: Language) => {
    setCurrentLang(lang)
    localStorage.setItem('language', lang)
  }

  return (
    <LanguageContext.Provider 
      value={{
        language: translations[currentLang],
        currentLang,
        setLanguage
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

/**
 * Hook to use the language context
 * @returns {LanguageContextType} Language context
 * @throws {Error} If hook is used outside of LanguageProvider
 */
export function useLang() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLang must be used within a LanguageProvider')
  }
  return context
} 