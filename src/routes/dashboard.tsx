import { createFileRoute } from '@tanstack/react-router'
import { DashboardLayout } from '@/components/layout'
import { useAccounts } from '@/apis/accounts'
import { useTransactions } from '@/apis/transactions'
import { useBudgets } from '@/apis/budgets'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const { data: accountsData, isLoading: accountsLoading } = useAccounts({
    per_page: 5,
  })
  const { data: transactionsData, isLoading: transactionsLoading } =
    useTransactions({ per_page: 5 })
  const { data: budgetsData, isLoading: budgetsLoading } = useBudgets({
    per_page: 5,
  })

  const totalBalance =
    accountsData?.data.reduce((sum, acc) => sum + acc.balance, 0) ?? 0
  const formatCurrency = (cents: number) => `$${(cents / 100).toFixed(2)}`

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Balance</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {accountsLoading ? '...' : formatCurrency(totalBalance)}
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-sm font-medium text-gray-500">Accounts</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {accountsLoading ? '...' : (accountsData?.meta.total_data ?? 0)}
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-sm font-medium text-gray-500">
              Active Budgets
            </h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {budgetsLoading ? '...' : (budgetsData?.meta.total_data ?? 0)}
            </p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Transactions */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Recent Transactions
            </h2>
            {transactionsLoading ? (
              <p className="text-gray-500">Loading...</p>
            ) : transactionsData?.data.length === 0 ? (
              <p className="text-gray-500">No transactions yet</p>
            ) : (
              <ul className="space-y-3">
                {transactionsData?.data.map((tx) => (
                  <li
                    key={tx.id}
                    className="flex items-center justify-between border-b pb-2"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {tx.category || tx.description || 'Transaction'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {tx.transaction_type}
                      </p>
                    </div>
                    <span
                      className={`font-semibold ${
                        tx.transaction_type === 'Income'
                          ? 'text-green-600'
                          : tx.transaction_type === 'Expense'
                            ? 'text-red-600'
                            : 'text-gray-600'
                      }`}
                    >
                      {tx.transaction_type === 'Income' ? '+' : '-'}
                      {formatCurrency(tx.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Accounts Overview */}
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Your Accounts
            </h2>
            {accountsLoading ? (
              <p className="text-gray-500">Loading...</p>
            ) : accountsData?.data.length === 0 ? (
              <p className="text-gray-500">No accounts yet</p>
            ) : (
              <ul className="space-y-3">
                {accountsData?.data.map((account) => (
                  <li
                    key={account.id}
                    className="flex items-center justify-between border-b pb-2"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {account.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {account.account_type}
                      </p>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(account.balance)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
