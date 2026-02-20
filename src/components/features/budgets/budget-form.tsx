import { useForm, z } from '@/libs/tanstack-form'
import { TextField, SelectField } from '@/components/ui/input-fields'
import {
  useCreateBudget,
  useUpdateBudget,
  type Budget,
  type BudgetPeriod,
} from '@/apis/budgets'

const budgetPeriodOptions = [
  { value: 'Daily', label: 'Daily' },
  { value: 'Weekly', label: 'Weekly' },
  { value: 'Monthly', label: 'Monthly' },
  { value: 'Yearly', label: 'Yearly' },
]

const budgetSchema = z.object({
  category: z.string().min(1, 'Category is required').max(100),
  amount: z.number().positive('Amount must be positive'),
  period: z.enum(['Daily', 'Weekly', 'Monthly', 'Yearly']),
  start_date: z.string(),
  end_date: z.string().optional(),
})

type BudgetFormProps = {
  budget?: Budget
  onSuccess: () => void
  onCancel: () => void
}

export function BudgetForm({ budget, onSuccess, onCancel }: BudgetFormProps) {
  const createMutation = useCreateBudget()
  const updateMutation = useUpdateBudget()
  const isEditing = !!budget

  const form = useForm({
    defaultValues: {
      category: budget?.category ?? '',
      amount: budget ? budget.amount / 100 : 0,
      period: (budget?.period ?? 'Monthly') as BudgetPeriod,
      start_date: budget
        ? budget.start_date.split('T')[0]
        : new Date().toISOString().split('T')[0],
      end_date: budget?.end_date?.split('T')[0] ?? '',
    },
    onSubmit: async ({ value }) => {
      if (isEditing) {
        await updateMutation.mutateAsync({
          id: budget.id,
          data: {
            category: value.category,
            amount: Math.round(value.amount * 100),
          },
        })
      } else {
        await createMutation.mutateAsync({
          ...value,
          amount: Math.round(value.amount * 100),
          start_date: new Date(value.start_date).toISOString(),
          end_date: value.end_date
            ? new Date(value.end_date).toISOString()
            : undefined,
        })
      }
      onSuccess()
    },
  })

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h2 className="mb-4 text-lg font-semibold">
        {isEditing ? 'Edit Budget' : 'Create New Budget'}
      </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
        className="grid gap-4 md:grid-cols-2"
      >
        <form.Field
          name="category"
          validators={{ onChange: budgetSchema.shape.category }}
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
          validators={{ onChange: budgetSchema.shape.amount }}
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

        {!isEditing && (
          <>
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
          </>
        )}

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
                : 'Create Budget'}
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
