import { Link, useNavigate } from '@tanstack/react-router'
import { useUser, useLogout } from '@/apis/auth'
import { ProtectedRoute } from '@/components/auth'

type DashboardLayoutProps = {
  children: React.ReactNode
}

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/accounts', label: 'Accounts' },
  { to: '/transactions', label: 'Transactions' },
  { to: '/budgets', label: 'Budgets' },
]

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const user = useUser()
  const logoutMutation = useLogout()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logoutMutation.mutateAsync()
    navigate({ to: '/login' })
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 text-white">
          <div className="p-4">
            <h1 className="text-xl font-bold">ABBP</h1>
            <p className="text-sm text-gray-400">Axum Backend Best Practice</p>
          </div>

          <nav className="mt-6">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white [&.active]:bg-gray-800 [&.active]:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <div className="flex flex-1 flex-col">
          {/* Header */}
          <header className="flex items-center justify-between bg-white px-6 py-4 shadow">
            <div />
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {user?.first_name || user?.email}
              </span>
              <button
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                className="rounded-md bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-300 disabled:opacity-50"
              >
                {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
