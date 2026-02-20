// Base API Response Types (matching Axum backend)

export type SingleResponse<T> = {
  message: string
  data: T
  version: string
}

export type ListResponse<T> = {
  message: string
  data: T[]
  meta: PaginationMeta
  version: string
}

export type MessageOnlyResponse = {
  message: string
  version: string
}

export type ErrorResponse = {
  message: string
  stack_trace?: string[]
  version: string
}

export type PaginationMeta = {
  page: number
  per_page: number
  total_pages: number
  total_data: number
}

// Query Parameters
export type PaginationParams = {
  page?: number
  per_page?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
  search?: string
}

// Legacy types for backwards compatibility
export type ApiResponse<T> = SingleResponse<T>

export type PaginatedResponse<T> = {
  data: T[]
  meta: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

export type ApiError = ErrorResponse
