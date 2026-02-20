import { useDeleteTransaction, type Transaction } from '@/apis/transactions'

type TransactionTableProps = {
  transactions: Transaction[]
  onEdit: (transaction: Transaction) => void
}

export function TransactionTable({
  transactions,
  onEdit,
}: TransactionTableProps) {
  const deleteMutation = useDeleteTransaction()
  const formatCurrency = (cents: number) => `$${(cents / 100).toFixed(2)}`
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString()

  return (
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
        {transactions.map((tx) => (
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
            <td className="px-6 py-4 text-gray-500">{tx.description || '-'}</td>
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
                onClick={() => onEdit(tx)}
                className="mr-3 text-blue-600 hover:text-blue-900"
              >
                Edit
              </button>
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
  )
}
