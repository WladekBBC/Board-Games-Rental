'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Theme = 'light' | 'dark'

/**
 * Theme context type
 * @interface ThemeContextType
 */
interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

/**
 * Theme context provider
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Component children
 * @returns {JSX.Element} Theme context provider
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')

  /**
   * Initializes the theme when the application starts
   */
  useEffect(() => {
    // Load the saved theme
    const savedTheme = localStorage.getItem('theme') as Theme
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.classList.add(savedTheme)
    } else {
      // Check system settings
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const initialTheme = prefersDark ? 'dark' : 'light'
      setTheme(initialTheme)
      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.classList.add(initialTheme)
    }
  }, [])

  /**
   * Switches between light and dark themes
   */
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * Hook to use the theme context
 * @returns {ThemeContextType} Theme context
 * @throws {Error} If hook is used outside of ThemeProvider
 */
export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
} 