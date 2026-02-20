import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { DashboardLayout } from '@/components/layout'
import {
  useBudgets,
  useCreateBudget,
  useDeleteBudget,
  type BudgetPeriod,
} from '@/apis/budgets'
import { useForm, z } from '@/libs/tanstack-form'
import { TextField, SelectField } from '@/components/ui/input-fields'

export const Route = createFileRoute('/budgets')({
  component: BudgetsPage,
})

const budgetPeriodOptions = [
  { value: 'Daily', label: 'Daily' },
  { value: 'Weekly', label: 'Weekly' },
  { value: 'Monthly', label: 'Monthly' },
  { value: 'Yearly', label: 'Yearly' },
]

const createBudgetSchema = z.object({
  category: z.string().min(1, 'Category is required').max(100),
  amount: z.number().positive('Amount must be positive'),
  period: z.enum(['Daily', 'Weekly', 'Monthly', 'Yearly']),
  start_date: z.string(),
  end_date: z.string().optional(),
})

function BudgetsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const { data, isLoading, error } = useBudgets()
  const createMutation = useCreateBudget()
  const deleteMutation = useDeleteBudget()

  const form = useForm({
    defaultValues: {
      category: '',
      amount: 0,
      period: 'Monthly' as BudgetPeriod,
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
    },
    onSubmit: async ({ value }) => {
      await createMutation.mutateAsync({
        ...value,
        amount: Math.round(value.amount * 100), // Convert to cents
        start_date: new Date(value.start_date).toISOString(),
        end_date: value.end_date
          ? new Date(value.end_date).toISOString()
          : undefined,
      })
      setShowCreateForm(false)
      form.reset()
    },
  })

  const formatCurrency = (cents: number) => `$${(cents / 100).toFixed(2)}`
  const formatDate = (dateStr: string | null) =>
    dateStr ? new Date(dateStr).toLocaleDateString() : '-'

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Budgets</h1>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
          >
            {showCreateForm ? 'Cancel' : 'Add Budget'}
          </button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-semibold">Create New Budget</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit()
              }}
              className="grid gap-4 md:grid-cols-2"
            >
              <form.Field
                name="category"
                validators={{ onChange: createBudgetSchema.shape.category }}
              >
                {(field) => (
                  <TextField
                    field={field}
                    label="Category"
                    placeholder="Food, Entertainment, etc."
                    className="block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                )}
              </form.Field>

              <form.Field
                name="amount"
                validators={{ onChange: createBudgetSchema.shape.amount }}
              >
                {(field) => (
                  <TextField
                    field={field}
                    label="Budget Amount"
                    type="number"
                    placeholder="0.00"
                    className="block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                )}
              </form.Field>

              <form.Field name="period">
                {(field) => (
                  <SelectField
                    field={field}
                    label="Period"
                    options={budgetPeriodOptions}
                    className="block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                )}
              </form.Field>

              <form.Field name="start_date">
                {(field) => (
                  <TextField
                    field={field}
                    label="Start Date"
                    type="text"
                    placeholder="YYYY-MM-DD"
                    className="block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                )}
              </form.Field>

              <form.Field name="end_date">
                {(field) => (
                  <TextField
                    field={field}
                    label="End Date (Optional)"
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
                  {createMutation.isPending ? 'Creating...' : 'Create Budget'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Budgets List */}
        <div className="rounded-lg bg-white shadow">
          {isLoading ? (
            <p className="p-6 text-gray-500">Loading budgets...</p>
          ) : error ? (
            <p className="p-6 text-red-500">Error loading budgets</p>
          ) : data?.data.length === 0 ? (
            <p className="p-6 text-gray-500">
              No budgets yet. Create your first budget!
            </p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    End Date
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
                {data?.data.map((budget) => (
                  <tr key={budget.id}>
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                      {budget.category}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-900">
                      {formatCurrency(budget.amount)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                      {budget.period}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                      {formatDate(budget.start_date)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                      {formatDate(budget.end_date)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          budget.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {budget.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <button
                        onClick={() => deleteMutation.mutate(budget.id)}
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
