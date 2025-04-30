'use client'

import { useAuth } from '@/lib/contexts/AuthContext'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

/**
 * AdminProtected component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be rendered
 * @returns {JSX.Element} The admin protected component
 */
export function AdminProtected({ children }: { children: React.ReactNode }) {
  const { user, loading, permissions } = useAuth()

  useEffect(() => {
    if (!loading && (!user || permissions != "Admin")) {
      redirect('/')
    }
  }, [loading, user, permissions])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!user || permissions != "Admin") {
    return null
  }

  return <>{children}</>
} 