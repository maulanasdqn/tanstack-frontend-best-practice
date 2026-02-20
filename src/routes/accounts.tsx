import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { DashboardLayout } from '@/components/layout'
import { useAccounts, type Account } from '@/apis/accounts'
import { AccountForm, AccountTable } from '@/components/features/accounts'
import { Button, Card, DataState, PageHeader } from '@/components/ui'

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
        <PageHeader title="Accounts">
          <Button onClick={formState.open ? handleClose : handleCreate}>
            {formState.open ? 'Cancel' : 'Add Account'}
          </Button>
        </PageHeader>

        {formState.open && (
          <AccountForm
            account={formState.account}
            onSuccess={handleClose}
            onCancel={handleClose}
          />
        )}

        <Card padding={false}>
          <DataState
            data={data?.data}
            isLoading={isLoading}
            error={error}
            loadingText="Loading accounts..."
            errorText="Error loading accounts"
            emptyText="No accounts yet. Create your first account!"
          >
            {(accounts) => (
              <AccountTable accounts={accounts} onEdit={handleEdit} />
            )}
          </DataState>
        </Card>
      </div>
    </DashboardLayout>
  )
}
