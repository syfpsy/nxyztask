'use client'

import { useAuthStore } from '@/lib/authStore'
import AuthForm from './AuthForm'
import ThemeToggle from './ThemeToggle'
import { LogOut, LayoutDashboard, Home as HomeIcon } from 'lucide-react'
import Link from 'next/link'

const AuthHeader = () => {
  const { isLoggedIn, currentUser, userRole, logout } = useAuthStore() // Changed to currentUser

  return (
    <header className="bg-gray-900 text-white p-4 shadow-md dark:bg-gray-950 dark:text-gray-100">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">TaskFlow</h1>
          <Link href="/" className="flex items-center gap-1 text-sm px-3 py-1 rounded-md hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors">
            <HomeIcon size={16} />
            Home
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="flex items-center gap-1 text-sm px-3 py-1 rounded-md hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors">
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              <span className="text-sm">
                Welcome, <span className="font-semibold">{currentUser?.name || currentUser?.email}</span> ({userRole}) {/* Display name or email */}
              </span>
              <button
                onClick={logout}
                className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700 transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <AuthForm />
          )}
        </div>
      </div>
    </header>
  )
}

export default AuthHeader