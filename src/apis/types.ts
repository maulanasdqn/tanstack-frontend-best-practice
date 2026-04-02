export type TSingleResponse<T> = {
  message: string
  data: T
  version: string
}

export type TListResponse<T> = {
  message: string
  data: T[]
  meta: TPaginationMeta
  version: string
}

export type TMessageOnlyResponse = {
  message: string
  version: string
}

export type TErrorResponse = {
  message: string
  stack_trace?: string[]
  version: string
}

export type TPaginationMeta = {
  page: number
  per_page: number
  total_pages: number
  total_data: number
}

export type TPaginationParams = {
  page?: number
  per_page?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
  search?: string
}
