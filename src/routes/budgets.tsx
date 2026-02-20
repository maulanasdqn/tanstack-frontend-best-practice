import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { DashboardLayout } from '@/components/layout'
import { useBudgets, type Budget } from '@/apis/budgets'
import { BudgetForm, BudgetTable } from '@/components/features/budgets'
import { Button, Card, DataState, PageHeader } from '@/components/ui'

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
        <PageHeader title="Budgets">
          <Button onClick={formState.open ? handleClose : handleCreate}>
            {formState.open ? 'Cancel' : 'Add Budget'}
          </Button>
        </PageHeader>

        {formState.open && (
          <BudgetForm
            budget={formState.budget}
            onSuccess={handleClose}
            onCancel={handleClose}
          />
        )}

        <Card padding={false}>
          <DataState
            data={data?.data}
            isLoading={isLoading}
            error={error}
            loadingText="Loading budgets..."
            errorText="Error loading budgets"
            emptyText="No budgets yet. Create your first budget!"
          >
            {(budgets) => <BudgetTable budgets={budgets} onEdit={handleEdit} />}
          </DataState>
        </Card>
      </div>
    </DashboardLayout>
  )
}
