import { useForm, z } from '@/libs/tanstack-form'
import { TextField, SelectField } from '@/components/ui/input-fields'
import {
  useCreateAccount,
  useUpdateAccount,
  type Account,
  type AccountType,
} from '@/apis/accounts'

const accountTypeOptions = [
  { value: 'Checking', label: 'Checking' },
  { value: 'Savings', label: 'Savings' },
  { value: 'Credit', label: 'Credit' },
  { value: 'Investment', label: 'Investment' },
  { value: 'Cash', label: 'Cash' },
]

const accountSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  account_type: z.enum(['Checking', 'Savings', 'Credit', 'Investment', 'Cash']),
  initial_balance: z.number(),
  currency: z.string().length(3, 'Currency must be 3 characters'),
})

type AccountFormProps = {
  account?: Account
  onSuccess: () => void
  onCancel: () => void
}

export function AccountForm({
  account,
  onSuccess,
  onCancel,
}: AccountFormProps) {
  const createMutation = useCreateAccount()
  const updateMutation = useUpdateAccount()
  const isEditing = !!account

  const form = useForm({
    defaultValues: {
      name: account?.name ?? '',
      account_type: (account?.account_type ?? 'Checking') as AccountType,
      initial_balance: account ? account.balance / 100 : 0,
      currency: account?.currency ?? 'USD',
    },
    onSubmit: async ({ value }) => {
      if (isEditing) {
        await updateMutation.mutateAsync({
          id: account.id,
          data: { name: value.name },
        })
      } else {
        await createMutation.mutateAsync({
          ...value,
          initial_balance: Math.round(value.initial_balance * 100),
        })
      }
      onSuccess()
    },
  })

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h2 className="mb-4 text-lg font-semibold">
        {isEditing ? 'Edit Account' : 'Create New Account'}
      </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
        className="grid gap-4 md:grid-cols-2"
      >
        <form.Field
          name="name"
          validators={{ onChange: accountSchema.shape.name }}
        >
          {(field) => (
            <TextField
              field={field}
              label="Account Name"
              placeholder="My Savings"
              className="block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          )}
        </form.Field>

        {!isEditing && (
          <>
            <form.Field name="account_type">
              {(field) => (
                <SelectField
                  field={field}
                  label="Account Type"
                  options={accountTypeOptions}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              )}
            </form.Field>

            <form.Field name="initial_balance">
              {(field) => (
                <TextField
                  field={field}
                  label="Initial Balance"
                  type="number"
                  placeholder="0.00"
                  className="block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              )}
            </form.Field>

            <form.Field
              name="currency"
              validators={{ onChange: accountSchema.shape.currency }}
            >
              {(field) => (
                <TextField
                  field={field}
                  label="Currency"
                  placeholder="USD"
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
                : 'Create Account'}
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
