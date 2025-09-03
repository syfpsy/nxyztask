'use client'

import { useThemeStore } from '@/lib/themeStore'
import { Sun, Moon } from 'lucide-react'

const ThemeToggle = () => {
  const { theme, toggleTheme } = useThemeStore()

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white dark:bg-gray-200 dark:text-gray-800 dark:hover:bg-gray-300 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  )
}

export default ThemeToggle