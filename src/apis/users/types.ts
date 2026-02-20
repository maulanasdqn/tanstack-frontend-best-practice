// User API Types

export type User = {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  created_at: string
  updated_at: string
}

export type CreateUserRequest = {
  email: string
  password: string
  first_name?: string
  last_name?: string
}

export type UpdateUserRequest = {
  first_name?: string
  last_name?: string
}

export type UserFilters = {
  email?: string
  first_name?: string
  last_name?: string
}
