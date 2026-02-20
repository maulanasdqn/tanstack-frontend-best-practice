import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { DashboardLayout } from '@/components/layout'
import { useBudgets, type Budget } from '@/apis/budgets'
import { BudgetForm, BudgetTable } from '@/components/features/budgets'

export const Route = createFileRoute('/budgets')({
  component: BudgetsPage,
})

function BudgetsPage() {
  const [formState, setFormState] = useState<{
    open: boolean
    budget?: Budget
  }>({ open: false })

  const { data, isLoading, error } = useBudgets()

  const handleCreate = () => setFormState({ open: true })
  const handleEdit = (budget: Budget) => setFormState({ open: true, budget })
  const handleClose = () => setFormState({ open: false })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Budgets</h1>
          <button
            onClick={formState.open ? handleClose : handleCreate}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
          >
            {formState.open ? 'Cancel' : 'Add Budget'}
          </button>
        </div>

        {formState.open && (
          <BudgetForm
            budget={formState.budget}
            onSuccess={handleClose}
            onCancel={handleClose}
          />
        )}

        <div className="rounded-lg bg-white shadow">
          {isLoading ? (
            <p className="p-6 text-gray-500">Loading budgets...</p>
          ) : error ? (
            <p className="p-6 text-red-500">Error loading budgets</p>
          ) : data?.data.length === 0 ? (
            <p className="p-6 text-gray-500">
              No budgets yet. Create your first budget!
            </p>
          ) : (
            <BudgetTable budgets={data?.data ?? []} onEdit={handleEdit} />
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
