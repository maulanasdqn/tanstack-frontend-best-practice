import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { DashboardLayout } from '@/components/layout'
import { useTransactions, type Transaction } from '@/apis/transactions'
import { useAccounts } from '@/apis/accounts'
import {
  TransactionForm,
  TransactionTable,
} from '@/components/features/transactions'
import { Button, Card, DataState, PageHeader } from '@/components/ui'

export const Route = createFileRoute('/transactions')({
  component: TransactionsPage,
})

function TransactionsPage() {
  const [formState, setFormState] = useState<{
    open: boolean
    transaction?: Transaction
  }>({ open: false })

  const { data, isLoading, error } = useTransactions()
  const { data: accountsData } = useAccounts()

  const accountOptions =
    accountsData?.data.map((acc) => ({
      value: acc.id,
      label: acc.name,
    })) ?? []

  const handleCreate = () => setFormState({ open: true })
  const handleEdit = (transaction: Transaction) =>
    setFormState({ open: true, transaction })
  const handleClose = () => setFormState({ open: false })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Transactions">
          <Button onClick={formState.open ? handleClose : handleCreate}>
            {formState.open ? 'Cancel' : 'Add Transaction'}
          </Button>
        </PageHeader>

        {formState.open && (
          <TransactionForm
            transaction={formState.transaction}
            accountOptions={accountOptions}
            onSuccess={handleClose}
            onCancel={handleClose}
          />
        )}

        <Card padding={false}>
          <DataState
            data={data?.data}
            isLoading={isLoading}
            error={error}
            loadingText="Loading transactions..."
            errorText="Error loading transactions"
            emptyText="No transactions yet."
          >
            {(transactions) => (
              <TransactionTable
                transactions={transactions}
                onEdit={handleEdit}
              />
            )}
          </DataState>
        </Card>
      </div>
    </DashboardLayout>
  )
}
