'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { translations, Language } from '../i18n/translations'

type LanguageContextType = {
  language: typeof translations.pl
  currentLang: Language
  setLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLang, setCurrentLang] = useState<Language>('ua')

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language
    if (savedLang && (savedLang === 'pl' || savedLang === 'ua')) {
      setCurrentLang(savedLang)
    }
  }, [])

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

export function useLang() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLang must be used within a LanguageProvider')
  }
  return context
} 