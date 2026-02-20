import { useDeleteAccount, type Account } from '@/apis/accounts'

type AccountTableProps = {
  accounts: Account[]
  onEdit: (account: Account) => void
}

export function AccountTable({ accounts, onEdit }: AccountTableProps) {
  const deleteMutation = useDeleteAccount()
  const formatCurrency = (cents: number) => `$${(cents / 100).toFixed(2)}`

  return (
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
        {accounts.map((account) => (
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
                onClick={() => onEdit(account)}
                className="mr-3 text-blue-600 hover:text-blue-900"
              >
                Edit
              </button>
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
  )
}
