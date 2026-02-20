import { useForm, z } from '@/libs/tanstack-form'
import { TextField, SelectField } from '@/components/ui/input-fields'
import { Button, Card, CardHeader } from '@/components/ui'
import {
  useCreateTransaction,
  useUpdateTransaction,
  type Transaction,
  type TransactionType,
} from '@/apis/transactions'

const transactionTypeOptions = [
  { value: 'Income', label: 'Income' },
  { value: 'Expense', label: 'Expense' },
  { value: 'Transfer', label: 'Transfer' },
]

const transactionSchema = z.object({
  account_id: z.string().min(1, 'Account is required'),
  transaction_type: z.enum(['Income', 'Expense', 'Transfer']),
  amount: z.number().positive('Amount must be positive'),
  category: z.string().optional(),
  description: z.string().optional(),
  transaction_date: z.string(),
})

type AccountOption = { value: string; label: string }

type TransactionFormProps = {
  transaction?: Transaction
  accountOptions: AccountOption[]
  onSuccess: () => void
  onCancel: () => void
}

export function TransactionForm({
  transaction,
  accountOptions,
  onSuccess,
  onCancel,
}: TransactionFormProps) {
  const createMutation = useCreateTransaction()
  const updateMutation = useUpdateTransaction()
  const isEditing = !!transaction

  const form = useForm({
    defaultValues: {
      account_id: transaction?.account_id ?? '',
      transaction_type: (transaction?.transaction_type ??
        'Expense') as TransactionType,
      amount: transaction ? transaction.amount / 100 : 0,
      category: transaction?.category ?? '',
      description: transaction?.description ?? '',
      transaction_date: transaction
        ? transaction.transaction_date.split('T')[0]
        : new Date().toISOString().split('T')[0],
    },
    onSubmit: async ({ value }) => {
      if (isEditing) {
        await updateMutation.mutateAsync({
          id: transaction.id,
          data: { category: value.category, description: value.description },
        })
      } else {
        await createMutation.mutateAsync({
          ...value,
          amount: Math.round(value.amount * 100),
          transaction_date: new Date(value.transaction_date).toISOString(),
        })
      }
      onSuccess()
    },
  })

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <Card>
      <CardHeader
        title={isEditing ? 'Edit Transaction' : 'Create New Transaction'}
      />
      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
        className="grid gap-4 md:grid-cols-2"
      >
        {!isEditing && (
          <>
            <form.Field
              name="account_id"
              validators={{ onChange: transactionSchema.shape.account_id }}
            >
              {(field) => (
                <SelectField
                  field={field}
                  label="Account"
                  options={accountOptions}
                />
              )}
            </form.Field>

            <form.Field name="transaction_type">
              {(field) => (
                <SelectField
                  field={field}
                  label="Type"
                  options={transactionTypeOptions}
                />
              )}
            </form.Field>

            <form.Field
              name="amount"
              validators={{ onChange: transactionSchema.shape.amount }}
            >
              {(field) => (
                <TextField
                  field={field}
                  label="Amount"
                  type="number"
                  placeholder="0.00"
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
                />
              )}
            </form.Field>
          </>
        )}

        <form.Field name="category">
          {(field) => (
            <TextField
              field={field}
              label="Category"
              placeholder="Food, Transport, etc."
            />
          )}
        </form.Field>

        <form.Field name="description">
          {(field) => (
            <TextField
              field={field}
              label="Description"
              placeholder="Optional description"
            />
          )}
        </form.Field>

        <div className="flex gap-2 md:col-span-2">
          <Button type="submit" isLoading={isPending}>
            {isEditing ? 'Save Changes' : 'Create Transaction'}
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  )
}
