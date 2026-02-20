// Transaction API Types

export type TransactionType = 'Income' | 'Expense' | 'Transfer'

export type Transaction = {
  id: string
  account_id: string
  transaction_type: TransactionType
  amount: number
  category: string | null
  description: string | null
  transaction_date: string
  created_at: string
  updated_at: string
}

export type CreateTransactionRequest = {
  account_id: string
  transaction_type: TransactionType
  amount: number
  category?: string
  description?: string
  transaction_date: string
}

export type UpdateTransactionRequest = {
  category?: string
  description?: string
}

export type TransactionFilters = {
  account_id?: string
  transaction_type?: TransactionType
  category?: string
  min_amount?: number
  max_amount?: number
  start_date?: string
  end_date?: string
}
