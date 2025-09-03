import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import AuthHeader from '@/components/AuthHeader'
import ThemeWrapper from '@/components/ThemeWrapper' // Import ThemeWrapper

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Task Management App',
  description: 'A collaborative task management app with Kanban boards',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeWrapper> {/* Wrap children with ThemeWrapper */}
          <AuthHeader />
          {children}
        </ThemeWrapper>
      </body>
    </html>
  )
}