import { useAuthStore } from '@/apis/auth/store'

export function useSession() {
  const { user, isAuthenticated } = useAuthStore()
  const name = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || (user?.email ?? '')
  return {
    data: isAuthenticated && user
      ? { user: { name, email: user.email, image: '', role: 'user', createdAt: user.created_at ?? new Date().toISOString() } }
      : null,
  }
}
