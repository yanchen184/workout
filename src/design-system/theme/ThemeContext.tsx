import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'system',
  storageKey = 'workout-theme'
}) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // 嘗試從 localStorage 讀取主題設定
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(storageKey)
      return (saved as Theme) || defaultTheme
    }
    return defaultTheme
  })

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const root = document.documentElement

    // 處理系統主題
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

      const handleChange = () => {
        const isDark = mediaQuery.matches
        root.classList.toggle('dark', isDark)
        setResolvedTheme(isDark ? 'dark' : 'light')
      }

      handleChange()
      mediaQuery.addEventListener('change', handleChange)

      return () => mediaQuery.removeEventListener('change', handleChange)
    } else {
      // 直接設定主題
      root.classList.toggle('dark', theme === 'dark')
      setResolvedTheme(theme)
    }

    // 儲存主題設定
    localStorage.setItem(storageKey, theme)
  }, [theme, storageKey])

  // 添加主題變更時的過渡效果
  useEffect(() => {
    const root = document.documentElement
    root.style.transition = 'background-color 0.3s ease, color 0.3s ease'

    const timeout = setTimeout(() => {
      root.style.transition = ''
    }, 300)

    return () => clearTimeout(timeout)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Hook to use theme
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}