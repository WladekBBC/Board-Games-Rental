'use client'

import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import pl from './laguages/pl.json';
import ue from './laguages/ue.json';

type Language = 'pl' | 'ue'

interface LanguageContextType {
    lang: Language
    language: {[x:string]: string},
    toggleLanguage: () => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [lang, setLang] = useState<Language>('pl');
    const [language, setLanguage] = useState<{}>(pl);

    useEffect(() => {
      const savedLanguage = localStorage.getItem('lang') as Language
      if (savedLanguage) {
        setLang(savedLanguage)
        setLanguage(lang == 'pl' ? pl : ue)
      }
    })
  
    const toggleLanguage = () => {
      const newLang = lang === 'pl' ? 'ue' : 'pl'
      setLang(newLang);
      setLanguage(newLang === 'pl' ? pl : ue);
      localStorage.setItem('lang', newLang)
    }
  
    return (
      <LanguageContext.Provider value={{ lang, language, toggleLanguage }}>
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