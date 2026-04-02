import { useAuthStore } from '@/apis/auth/store'

export function useActiveOrganization() {
  const { user } = useAuthStore()
  return {
    data: user ? { id: user.id, name: 'My Organization', slug: 'default', logo: null } : null,
  }
}
