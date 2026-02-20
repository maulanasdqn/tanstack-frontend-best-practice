import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { DashboardLayout } from '@/components/layout'
import { useAccounts, type Account } from '@/apis/accounts'
import { AccountForm, AccountTable } from '@/components/features/accounts'

export const Route = createFileRoute('/accounts')({
  component: AccountsPage,
})

function AccountsPage() {
  const [formState, setFormState] = useState<{
    open: boolean
    account?: Account
  }>({ open: false })

  const { data, isLoading, error } = useAccounts()

  const handleCreate = () => setFormState({ open: true })
  const handleEdit = (account: Account) => setFormState({ open: true, account })
  const handleClose = () => setFormState({ open: false })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Accounts</h1>
          <button
            onClick={formState.open ? handleClose : handleCreate}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
          >
            {formState.open ? 'Cancel' : 'Add Account'}
          </button>
        </div>

        {formState.open && (
          <AccountForm
            account={formState.account}
            onSuccess={handleClose}
            onCancel={handleClose}
          />
        )}

        <div className="rounded-lg bg-white shadow">
          {isLoading ? (
            <p className="p-6 text-gray-500">Loading accounts...</p>
          ) : error ? (
            <p className="p-6 text-red-500">Error loading accounts</p>
          ) : data?.data.length === 0 ? (
            <p className="p-6 text-gray-500">
              No accounts yet. Create your first account!
            </p>
          ) : (
            <AccountTable accounts={data?.data ?? []} onEdit={handleEdit} />
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
