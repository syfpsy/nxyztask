'use client'

import { useState } from 'react'
import { useAuthStore } from '@/lib/authStore'

const AuthForm = () => {
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [email, setEmail] = useState('') // Changed from username to email
  const [password, setPassword] = useState('')
  const [name, setName] = useState('') // For signup
  const [error, setError] = useState('')
  const login = useAuthStore((state) => state.login)
  const register = useAuthStore((state) => state.register)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    let success = false
    if (isLoginMode) {
      success = login(email, password) // Changed to email
      if (!success) {
        setError('Invalid email or password.') // Changed error message
      }
    } else {
      if (!name || !email || !password) { // Changed to email
        setError('All fields are required for signup.')
        return
      }
      success = register(email, password, name) // Changed to email
      if (!success) {
        setError('Email already taken.') // Changed error message
      }
    }
    if (success) {
      setEmail('') // Changed to email
      setPassword('')
      setName('')
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        {!isLoginMode && (
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        )}
        <input
          type="email" // Changed type to email
          placeholder="Email (admin@example.com / user@example.com)" // Updated placeholder
          value={email} // Changed from username to email
          onChange={(e) => setEmail(e.target.value)} // Changed from setUsername to setEmail
          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <input
          type="password"
          placeholder="Password (admin/user)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition-colors"
        >
          {isLoginMode ? 'Login' : 'Sign Up'}
        </button>
      </form>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsLoginMode(!isLoginMode)}
          className="text-blue-400 dark:text-blue-300 text-xs hover:underline"
        >
          {isLoginMode ? 'Need an account? Sign Up' : 'Already have an account? Login'}
        </button>
        {error && <p className="text-red-500 dark:text-red-400 text-xs ml-2">{error}</p>}
      </div>
    </div>
  )
}

export default AuthForm