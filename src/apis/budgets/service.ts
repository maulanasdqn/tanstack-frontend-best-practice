import { apiClient } from '@/libs/axios'
import type {
  SingleResponse,
  ListResponse,
  MessageOnlyResponse,
  PaginationParams,
} from '../types'
import type {
  Budget,
  CreateBudgetRequest,
  UpdateBudgetRequest,
  BudgetFilters,
} from './types'

const BUDGETS_BASE = '/api/v1/budgets'

export type ListBudgetsParams = PaginationParams & BudgetFilters

export const budgetsService = {
  list: (params?: ListBudgetsParams) =>
    apiClient.get<ListResponse<Budget>>(BUDGETS_BASE, { params }),

  get: (id: string) =>
    apiClient.get<SingleResponse<Budget>>(`${BUDGETS_BASE}/${id}`),

  create: (data: CreateBudgetRequest) =>
    apiClient.post<SingleResponse<Budget>>(BUDGETS_BASE, data),

  update: (id: string, data: UpdateBudgetRequest) =>
    apiClient.patch<SingleResponse<Budget>>(`${BUDGETS_BASE}/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<MessageOnlyResponse>(`${BUDGETS_BASE}/${id}`),

  deactivate: (id: string) =>
    apiClient.post<MessageOnlyResponse>(`${BUDGETS_BASE}/${id}/deactivate`),
}
