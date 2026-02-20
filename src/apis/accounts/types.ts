// Account API Types

export type AccountType =
  | 'Checking'
  | 'Savings'
  | 'Credit'
  | 'Investment'
  | 'Cash'

export type Account = {
  id: string
  user_id: string
  name: string
  account_type: AccountType
  balance: number
  currency: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export type CreateAccountRequest = {
  name: string
  account_type: AccountType
  initial_balance: number
  currency: string
}

export type UpdateAccountRequest = {
  name?: string
}

export type AccountFilters = {
  name?: string
  account_type?: AccountType
  is_active?: boolean
  currency?: string
}
