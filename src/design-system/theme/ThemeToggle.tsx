import React from 'react'
import { motion } from 'framer-motion'
import { useTheme, Theme } from './ThemeContext'

interface ThemeToggleProps {
  className?: string
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  showLabel = false,
  size = 'md'
}) => {
  const { theme, setTheme } = useTheme()

  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  }

  const icons = {
    light: '☀️',
    dark: '🌙',
    system: '💻'
  }

  const labels = {
    light: '淺色',
    dark: '深色',
    system: '系統'
  }

  const nextTheme = (): Theme => {
    const themes: Theme[] = ['light', 'dark', 'system']
    const currentIndex = themes.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themes.length
    return themes[nextIndex]
  }

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={() => setTheme(nextTheme())}
      className={`
        ${sizes[size]}
        relative flex items-center justify-center
        rounded-lg bg-gray-100 dark:bg-dark-700
        hover:bg-gray-200 dark:hover:bg-dark-600
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-primary-500
        ${className}
      `}
      aria-label={`切換主題 (目前: ${labels[theme]})`}
    >
      <motion.span
        key={theme}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="flex items-center gap-2"
      >
        <span>{icons[theme]}</span>
        {showLabel && (
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {labels[theme]}
          </span>
        )}
      </motion.span>
    </motion.button>
  )
}

// 進階版主題切換器（帶下拉選單）
interface AdvancedThemeToggleProps {
  className?: string
}

export const AdvancedThemeToggle: React.FC<AdvancedThemeToggleProps> = ({
  className = ''
}) => {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = React.useState(false)

  const options: { value: Theme; label: string; icon: string }[] = [
    { value: 'light', label: '淺色模式', icon: '☀️' },
    { value: 'dark', label: '深色模式', icon: '🌙' },
    { value: 'system', label: '跟隨系統', icon: '💻' }
  ]

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center gap-2 px-4 py-2
          rounded-lg bg-gray-100 dark:bg-dark-700
          hover:bg-gray-200 dark:hover:bg-dark-600
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-primary-500
        "
      >
        <span>{options.find(opt => opt.value === theme)?.icon}</span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {options.find(opt => opt.value === theme)?.label}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="
            absolute top-full mt-2 right-0
            w-48 py-2 bg-white dark:bg-dark-800
            rounded-lg shadow-xl border border-gray-200 dark:border-dark-700
            z-50
          "
        >
          {options.map(option => (
            <button
              key={option.value}
              onClick={() => {
                setTheme(option.value)
                setIsOpen(false)
              }}
              className={`
                w-full px-4 py-2 text-left
                flex items-center gap-3
                hover:bg-gray-100 dark:hover:bg-dark-700
                transition-colors duration-200
                ${theme === option.value ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'}
              `}
            >
              <span>{option.icon}</span>
              <span className="text-sm font-medium">{option.label}</span>
              {theme === option.value && (
                <svg
                  className="w-4 h-4 ml-auto"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  )
}