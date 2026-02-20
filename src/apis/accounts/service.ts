import { apiClient } from '@/libs/axios'
import type {
  SingleResponse,
  ListResponse,
  MessageOnlyResponse,
  PaginationParams,
} from '../types'
import type {
  Account,
  CreateAccountRequest,
  UpdateAccountRequest,
  AccountFilters,
} from './types'

const ACCOUNTS_BASE = '/api/v1/accounts'

export type ListAccountsParams = PaginationParams & AccountFilters

export const accountsService = {
  list: (params?: ListAccountsParams) =>
    apiClient.get<ListResponse<Account>>(ACCOUNTS_BASE, { params }),

  get: (id: string) =>
    apiClient.get<SingleResponse<Account>>(`${ACCOUNTS_BASE}/${id}`),

  create: (data: CreateAccountRequest) =>
    apiClient.post<SingleResponse<Account>>(ACCOUNTS_BASE, data),

  update: (id: string, data: UpdateAccountRequest) =>
    apiClient.patch<SingleResponse<Account>>(`${ACCOUNTS_BASE}/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<MessageOnlyResponse>(`${ACCOUNTS_BASE}/${id}`),

  deactivate: (id: string) =>
    apiClient.post<MessageOnlyResponse>(`${ACCOUNTS_BASE}/${id}/deactivate`),
}
