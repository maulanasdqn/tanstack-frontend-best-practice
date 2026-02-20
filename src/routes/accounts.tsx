import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { DashboardLayout } from '@/components/layout'
import {
  useAccounts,
  useCreateAccount,
  useDeleteAccount,
  type AccountType,
} from '@/apis/accounts'
import { useForm, z } from '@/libs/tanstack-form'
import { TextField, SelectField } from '@/components/ui/input-fields'

export const Route = createFileRoute('/accounts')({
  component: AccountsPage,
})

const accountTypeOptions = [
  { value: 'Checking', label: 'Checking' },
  { value: 'Savings', label: 'Savings' },
  { value: 'Credit', label: 'Credit' },
  { value: 'Investment', label: 'Investment' },
  { value: 'Cash', label: 'Cash' },
]

const createAccountSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  account_type: z.enum(['Checking', 'Savings', 'Credit', 'Investment', 'Cash']),
  initial_balance: z.number(),
  currency: z.string().length(3, 'Currency must be 3 characters'),
})

function AccountsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const { data, isLoading, error } = useAccounts()
  const createMutation = useCreateAccount()
  const deleteMutation = useDeleteAccount()

  const form = useForm({
    defaultValues: {
      name: '',
      account_type: 'Checking' as AccountType,
      initial_balance: 0,
      currency: 'USD',
    },
    onSubmit: async ({ value }) => {
      await createMutation.mutateAsync({
        ...value,
        initial_balance: Math.round(value.initial_balance * 100), // Convert to cents
      })
      setShowCreateForm(false)
      form.reset()
    },
  })

  const formatCurrency = (cents: number) => `$${(cents / 100).toFixed(2)}`

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Accounts</h1>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
          >
            {showCreateForm ? 'Cancel' : 'Add Account'}
          </button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-semibold">Create New Account</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit()
              }}
              className="grid gap-4 md:grid-cols-2"
            >
              <form.Field
                name="name"
                validators={{ onChange: createAccountSchema.shape.name }}
              >
                {(field) => (
                  <TextField
                    field={field}
                    label="Account Name"
                    placeholder="My Savings"
                    className="block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                )}
              </form.Field>

              <form.Field name="account_type">
                {(field) => (
                  <SelectField
                    field={field}
                    label="Account Type"
                    options={accountTypeOptions}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                )}
              </form.Field>

              <form.Field name="initial_balance">
                {(field) => (
                  <TextField
                    field={field}
                    label="Initial Balance"
                    type="number"
                    placeholder="0.00"
                    className="block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                )}
              </form.Field>

              <form.Field
                name="currency"
                validators={{ onChange: createAccountSchema.shape.currency }}
              >
                {(field) => (
                  <TextField
                    field={field}
                    label="Currency"
                    placeholder="USD"
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
                  {createMutation.isPending ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Accounts List */}
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
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Balance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {data?.data.map((account) => (
                  <tr key={account.id}>
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                      {account.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                      {account.account_type}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-900">
                      {formatCurrency(account.balance)} {account.currency}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          account.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {account.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <button
                        onClick={() => deleteMutation.mutate(account.id)}
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
