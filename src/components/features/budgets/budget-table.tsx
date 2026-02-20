import { useDeleteBudget, type Budget } from '@/apis/budgets'
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
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Category</TableHeader>
          <TableHeader>Amount</TableHeader>
          <TableHeader>Period</TableHeader>
          <TableHeader>Start Date</TableHeader>
          <TableHeader>End Date</TableHeader>
          <TableHeader>Status</TableHeader>
          <TableHeader align="right">Actions</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {budgets.map((budget) => (
          <TableRow key={budget.id}>
            <TableCell className="font-medium text-gray-900">
              {budget.category}
            </TableCell>
            <TableCell className="text-gray-900">
              {formatCurrency(budget.amount)}
            </TableCell>
            <TableCell className="text-gray-500">{budget.period}</TableCell>
            <TableCell className="text-gray-500">
              {formatDate(budget.start_date)}
            </TableCell>
            <TableCell className="text-gray-500">
              {formatDate(budget.end_date)}
            </TableCell>
            <TableCell>
              <Badge variant={budget.is_active ? 'success' : 'default'}>
                {budget.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </TableCell>
            <TableCell align="right">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(budget)}
                className="mr-2 text-blue-600 hover:text-blue-900"
              >
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteMutation.mutate(budget.id)}
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
