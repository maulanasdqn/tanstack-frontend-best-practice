import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { DashboardLayout } from '@/components/layout'
import { useTransactions, type Transaction } from '@/apis/transactions'
import { useAccounts } from '@/apis/accounts'
import {
  TransactionForm,
  TransactionTable,
} from '@/components/features/transactions'

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
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <button
            onClick={formState.open ? handleClose : handleCreate}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
          >
            {formState.open ? 'Cancel' : 'Add Transaction'}
          </button>
        </div>

        {formState.open && (
          <TransactionForm
            transaction={formState.transaction}
            accountOptions={accountOptions}
            onSuccess={handleClose}
            onCancel={handleClose}
          />
        )}

        <div className="rounded-lg bg-white shadow">
          {isLoading ? (
            <p className="p-6 text-gray-500">Loading transactions...</p>
          ) : error ? (
            <p className="p-6 text-red-500">Error loading transactions</p>
          ) : data?.data.length === 0 ? (
            <p className="p-6 text-gray-500">No transactions yet.</p>
          ) : (
            <TransactionTable
              transactions={data?.data ?? []}
              onEdit={handleEdit}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
