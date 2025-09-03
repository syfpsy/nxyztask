'use client'

import { useEffect } from 'react'
import { useThemeStore } from '@/lib/themeStore'

interface ThemeWrapperProps {
  children: React.ReactNode
}

const ThemeWrapper = ({ children }: ThemeWrapperProps) => {
  const { theme } = useThemeStore()

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme])

  return <>{children}</>
}

export default ThemeWrapper