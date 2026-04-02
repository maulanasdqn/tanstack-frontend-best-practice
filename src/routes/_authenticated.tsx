import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { authStore } from '@/apis/auth/store'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: () => {
    if (!authStore.state.isAuthenticated) {
      throw redirect({ to: '/auth/login' })
    }
  },
  component: () => <Outlet />,
})
