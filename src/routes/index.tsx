import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useIsAuthenticated } from '@/apis/auth'

export const Route = createFileRoute('/')({
  component: IndexComponent,
})

function IndexComponent() {
  const isAuthenticated = useIsAuthenticated()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/dashboard' })
    } else {
      navigate({ to: '/login' })
    }
  }, [isAuthenticated, navigate])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-lg">Loading...</div>
    </div>
  )
}
