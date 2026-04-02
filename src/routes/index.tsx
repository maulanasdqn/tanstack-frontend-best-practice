import { createFileRoute, redirect } from '@tanstack/react-router'
import { authStore } from '@/apis/auth/store'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    if (!authStore.state.isAuthenticated) {
      throw redirect({ to: '/auth/login' })
    }
    throw redirect({ to: '/$orgSlug/dashboard', params: { orgSlug: 'default' } })
  },
})
