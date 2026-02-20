// Budget API Types

export type BudgetPeriod = 'Daily' | 'Weekly' | 'Monthly' | 'Yearly'

export type Budget = {
  id: string
  user_id: string
  category: string
  amount: number
  period: BudgetPeriod
  start_date: string
  end_date: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export type CreateBudgetRequest = {
  category: string
  amount: number
  period: BudgetPeriod
  start_date: string
  end_date?: string
}

export type UpdateBudgetRequest = {
  category?: string
  amount?: number
}

export type BudgetFilters = {
  category?: string
  period?: BudgetPeriod
  is_active?: boolean
}
