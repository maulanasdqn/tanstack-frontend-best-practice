import { useDeleteAccount, type Account } from '@/apis/accounts'
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
  Badge,
  Button,
} from '@/components/ui'

type AccountTableProps = {
  accounts: Account[]
  onEdit: (account: Account) => void
}

export function AccountTable({ accounts, onEdit }: AccountTableProps) {
  const deleteMutation = useDeleteAccount()
  const formatCurrency = (cents: number) => `$${(cents / 100).toFixed(2)}`

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Name</TableHeader>
          <TableHeader>Type</TableHeader>
          <TableHeader>Balance</TableHeader>
          <TableHeader>Status</TableHeader>
          <TableHeader align="right">Actions</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {accounts.map((account) => (
          <TableRow key={account.id}>
            <TableCell className="font-medium text-gray-900">
              {account.name}
            </TableCell>
            <TableCell className="text-gray-500">
              {account.account_type}
            </TableCell>
            <TableCell className="text-gray-900">
              {formatCurrency(account.balance)} {account.currency}
            </TableCell>
            <TableCell>
              <Badge variant={account.is_active ? 'success' : 'default'}>
                {account.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </TableCell>
            <TableCell align="right">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(account)}
                className="mr-2 text-blue-600 hover:text-blue-900"
              >
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteMutation.mutate(account.id)}
                disabled={deleteMutation.isPending}
                className="text-red-600 hover:text-red-900"
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
