import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { authStore } from '@/apis/auth/store'

export const Route = createFileRoute('/_public')({
  beforeLoad: () => {
    if (authStore.state.isAuthenticated) {
      throw redirect({ to: '/$orgSlug/dashboard', params: { orgSlug: 'default' } })
    }
  },
  component: () => <Outlet />,
})
