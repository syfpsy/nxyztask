'use client'

import KanbanBoard from '@/components/KanbanBoard'
import { useAuthStore } from '@/lib/authStore'
import Link from 'next/link' // Import Link for navigation

export default function Home() {
  const { isLoggedIn } = useAuthStore()

  return (
    <main className="min-h-screen p-8 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">Task Management Board</h1>
        <KanbanBoard />

        {isLoggedIn && (
          <div className="mt-12 text-center">
            <Link href="/dashboard" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium">
              Go to Dashboard
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}