import { useDeleteTransaction, type Transaction } from '@/apis/transactions'
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

type TransactionTableProps = {
  transactions: Transaction[]
  onEdit: (transaction: Transaction) => void
}

const typeVariants = {
  Income: 'success',
  Expense: 'danger',
  Transfer: 'info',
} as const

export function TransactionTable({
  transactions,
  onEdit,
}: TransactionTableProps) {
  const deleteMutation = useDeleteTransaction()
  const formatCurrency = (cents: number) => `$${(cents / 100).toFixed(2)}`
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString()

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Date</TableHeader>
          <TableHeader>Type</TableHeader>
          <TableHeader>Category</TableHeader>
          <TableHeader>Description</TableHeader>
          <TableHeader align="right">Amount</TableHeader>
          <TableHeader align="right">Actions</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {transactions.map((tx) => (
          <TableRow key={tx.id}>
            <TableCell className="text-gray-500">
              {formatDate(tx.transaction_date)}
            </TableCell>
            <TableCell>
              <Badge variant={typeVariants[tx.transaction_type]}>
                {tx.transaction_type}
              </Badge>
            </TableCell>
            <TableCell className="text-gray-500">
              {tx.category || '-'}
            </TableCell>
            <TableCell className="text-gray-500">
              {tx.description || '-'}
            </TableCell>
            <TableCell
              align="right"
              className={`font-semibold ${
                tx.transaction_type === 'Income'
                  ? 'text-green-600'
                  : tx.transaction_type === 'Expense'
                    ? 'text-red-600'
                    : 'text-gray-900'
              }`}
            >
              {tx.transaction_type === 'Income' ? '+' : '-'}
              {formatCurrency(tx.amount)}
            </TableCell>
            <TableCell align="right">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(tx)}
                className="mr-2 text-blue-600 hover:text-blue-900"
              >
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteMutation.mutate(tx.id)}
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
