import { useAuthStore } from '@/apis/auth/store'

export function useHasPermission(resource: string, actions: string[]) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated && !!resource && actions.length >= 0
}
