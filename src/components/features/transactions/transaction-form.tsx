import { useForm, z } from '@/libs/tanstack-form'
import { TextField, SelectField } from '@/components/ui/input-fields'
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
    <div className="rounded-lg bg-white p-6 shadow">
      <h2 className="mb-4 text-lg font-semibold">
        {isEditing ? 'Edit Transaction' : 'Create New Transaction'}
      </h2>
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
              validators={{ onChange: transactionSchema.shape.amount }}
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
          </>
        )}

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

        <div className="flex gap-2 md:col-span-2">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
          >
            {isPending
              ? 'Saving...'
              : isEditing
                ? 'Save Changes'
                : 'Create Transaction'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
