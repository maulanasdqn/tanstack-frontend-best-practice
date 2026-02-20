import { useDeleteBudget, type Budget } from '@/apis/budgets'

type BudgetTableProps = {
  budgets: Budget[]
  onEdit: (budget: Budget) => void
}

export function BudgetTable({ budgets, onEdit }: BudgetTableProps) {
  const deleteMutation = useDeleteBudget()
  const formatCurrency = (cents: number) => `$${(cents / 100).toFixed(2)}`
  const formatDate = (dateStr: string | null) =>
    dateStr ? new Date(dateStr).toLocaleDateString() : '-'

  return (
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
        {budgets.map((budget) => (
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
                onClick={() => onEdit(budget)}
                className="mr-3 text-blue-600 hover:text-blue-900"
              >
                Edit
              </button>
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
  )
}
