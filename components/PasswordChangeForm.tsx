'use client'

import { useState } from 'react'
import { useAuthStore } from '@/lib/authStore'

const PasswordChangeForm = () => {
  const { userEmail, changePassword } = useAuthStore()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setError('')

    if (!userEmail) {
      setError('You must be logged in to change your password.')
      return
    }

    if (newPassword !== confirmNewPassword) {
      setError('New password and confirmation do not match.')
      return
    }

    if (newPassword.length < 6) { // Basic validation
      setError('New password must be at least 6 characters long.')
      return
    }

    const success = changePassword(userEmail, currentPassword, newPassword)

    if (success) {
      setMessage('Password changed successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
    } else {
      setError('Failed to change password. Please check your current password.')
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-8 max-w-md mx-auto">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Change Password</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Current Password
          </label>
          <input
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            New Password
          </label>
          <input
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            required
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 transition-colors"
        >
          Change Password
        </button>
        {message && <p className="text-green-600 dark:text-green-400 text-sm mt-2">{message}</p>}
        {error && <p className="text-red-500 dark:text-red-400 text-sm mt-2">{error}</p>}
      </form>
    </div>
  )
}

export default PasswordChangeForm