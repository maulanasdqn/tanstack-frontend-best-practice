import { useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useIsAuthenticated } from '@/apis/auth'

type ProtectedRouteProps = {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useIsAuthenticated()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/login' })
    }
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Redirecting to login...</div>
      </div>
    )
  }

  return <>{children}</>
}
