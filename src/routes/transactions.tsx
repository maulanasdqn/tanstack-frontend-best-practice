import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { DashboardLayout } from '@/components/layout'
import {
  useTransactions,
  useCreateTransaction,
  useDeleteTransaction,
  type TransactionType,
} from '@/apis/transactions'
import { useAccounts } from '@/apis/accounts'
import { useForm, z } from '@/libs/tanstack-form'
import { TextField, SelectField } from '@/components/ui/input-fields'

export const Route = createFileRoute('/transactions')({
  component: TransactionsPage,
})

const transactionTypeOptions = [
  { value: 'Income', label: 'Income' },
  { value: 'Expense', label: 'Expense' },
  { value: 'Transfer', label: 'Transfer' },
]

const createTransactionSchema = z.object({
  account_id: z.string().min(1, 'Account is required'),
  transaction_type: z.enum(['Income', 'Expense', 'Transfer']),
  amount: z.number().positive('Amount must be positive'),
  category: z.string().optional(),
  description: z.string().optional(),
  transaction_date: z.string(),
})

function TransactionsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const { data, isLoading, error } = useTransactions()
  const { data: accountsData } = useAccounts()
  const createMutation = useCreateTransaction()
  const deleteMutation = useDeleteTransaction()

  const accountOptions =
    accountsData?.data.map((acc) => ({
      value: acc.id,
      label: acc.name,
    })) ?? []

  const form = useForm({
    defaultValues: {
      account_id: '',
      transaction_type: 'Expense' as TransactionType,
      amount: 0,
      category: '',
      description: '',
      transaction_date: new Date().toISOString().split('T')[0],
    },
    onSubmit: async ({ value }) => {
      await createMutation.mutateAsync({
        ...value,
        amount: Math.round(value.amount * 100), // Convert to cents
        transaction_date: new Date(value.transaction_date).toISOString(),
      })
      setShowCreateForm(false)
      form.reset()
    },
  })

  const formatCurrency = (cents: number) => `$${(cents / 100).toFixed(2)}`
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
          >
            {showCreateForm ? 'Cancel' : 'Add Transaction'}
          </button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-semibold">
              Create New Transaction
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit()
              }}
              className="grid gap-4 md:grid-cols-2"
            >
              <form.Field
                name="account_id"
                validators={{
                  onChange: createTransactionSchema.shape.account_id,
                }}
              >
                {(field) => (
                  <SelectField
                    field={field}
                    label="Account"
                    options={accountOptions}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                )}
              </form.Field>

              <form.Field name="transaction_type">
                {(field) => (
                  <SelectField
                    field={field}
                    label="Type"
                    options={transactionTypeOptions}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                )}
              </form.Field>

              <form.Field
                name="amount"
                validators={{ onChange: createTransactionSchema.shape.amount }}
              >
                {(field) => (
                  <TextField
                    field={field}
                    label="Amount"
                    type="number"
                    placeholder="0.00"
                    className="block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                )}
              </form.Field>

              <form.Field name="category">
                {(field) => (
                  <TextField
                    field={field}
                    label="Category"
                    placeholder="Food, Transport, etc."
                    className="block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                )}
              </form.Field>

              <form.Field name="description">
                {(field) => (
                  <TextField
                    field={field}
                    label="Description"
                    placeholder="Optional description"
                    className="block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                )}
              </form.Field>

              <form.Field name="transaction_date">
                {(field) => (
                  <TextField
                    field={field}
                    label="Date"
                    type="text"
                    placeholder="YYYY-MM-DD"
                    className="block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                )}
              </form.Field>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
                >
                  {createMutation.isPending
                    ? 'Creating...'
                    : 'Create Transaction'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Transactions List */}
        <div className="rounded-lg bg-white shadow">
          {isLoading ? (
            <p className="p-6 text-gray-500">Loading transactions...</p>
          ) : error ? (
            <p className="p-6 text-red-500">Error loading transactions</p>
          ) : data?.data.length === 0 ? (
            <p className="p-6 text-gray-500">No transactions yet.</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Description
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {data?.data.map((tx) => (
                  <tr key={tx.id}>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                      {formatDate(tx.transaction_date)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          tx.transaction_type === 'Income'
                            ? 'bg-green-100 text-green-800'
                            : tx.transaction_type === 'Expense'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {tx.transaction_type}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                      {tx.category || '-'}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {tx.description || '-'}
                    </td>
                    <td
                      className={`whitespace-nowrap px-6 py-4 text-right font-semibold ${
                        tx.transaction_type === 'Income'
                          ? 'text-green-600'
                          : tx.transaction_type === 'Expense'
                            ? 'text-red-600'
                            : 'text-gray-900'
                      }`}
                    >
                      {tx.transaction_type === 'Income' ? '+' : '-'}
                      {formatCurrency(tx.amount)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <button
                        onClick={() => deleteMutation.mutate(tx.id)}
                        disabled={deleteMutation.isPending}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
