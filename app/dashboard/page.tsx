'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/authStore'
import PasswordChangeForm from '@/components/PasswordChangeForm'
import ProfileEditForm from '@/components/ProfileEditForm' // Import the new component

export default function DashboardPage() {
  const { isLoggedIn, currentUser, userRole } = useAuthStore() // Changed to currentUser
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/') // Redirect to home if not logged in
    }
  }, [isLoggedIn, router])

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-300">Redirecting to login...</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen p-8 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">User Dashboard</h1>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8 max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Your Profile</h2>
          {currentUser?.avatar && (
            <img src={currentUser.avatar} alt="User Avatar" className="w-20 h-20 rounded-full object-cover mb-4 mx-auto" />
          )}
          <p className="text-gray-700 dark:text-gray-200 mb-2 text-center">
            <span className="font-medium">Name:</span> {currentUser?.name}
          </p>
          <p className="text-gray-700 dark:text-gray-200 mb-2 text-center">
            <span className="font-medium">Email:</span> {currentUser?.email}
          </p>
          <p className="text-gray-700 dark:text-gray-200 text-center">
            <span className="font-medium">Role:</span> {userRole}
          </p>
        </div>

        <ProfileEditForm /> {/* New profile edit form */}
        <PasswordChangeForm />
      </div>
    </main>
  )
}