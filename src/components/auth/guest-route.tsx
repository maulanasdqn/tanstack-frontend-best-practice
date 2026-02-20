import { useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useIsAuthenticated } from '@/apis/auth'

type GuestRouteProps = {
  children: React.ReactNode
}

export function GuestRoute({ children }: GuestRouteProps) {
  const isAuthenticated = useIsAuthenticated()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/dashboard' })
    }
  }, [isAuthenticated, navigate])

  if (isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Redirecting to dashboard...</div>
      </div>
    )
  }

  return <>{children}</>
}
