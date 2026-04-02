import { useNavigate } from '@tanstack/react-router'
import { authActions } from '@/apis/auth/store'
import { useQueryClient } from '@/libs/tanstack-query'

export function useSignOut() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return () => {
    authActions.clearAuth()
    queryClient.clear()
    navigate({ to: '/auth/login' })
  }
}
