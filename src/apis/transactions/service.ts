import { apiClient } from '@/libs/axios'
import type {
  SingleResponse,
  ListResponse,
  MessageOnlyResponse,
  PaginationParams,
} from '../types'
import type {
  Transaction,
  CreateTransactionRequest,
  UpdateTransactionRequest,
  TransactionFilters,
} from './types'

const TRANSACTIONS_BASE = '/api/v1/transactions'

export type ListTransactionsParams = PaginationParams & TransactionFilters

export const transactionsService = {
  list: (params?: ListTransactionsParams) =>
    apiClient.get<ListResponse<Transaction>>(TRANSACTIONS_BASE, { params }),

  get: (id: string) =>
    apiClient.get<SingleResponse<Transaction>>(`${TRANSACTIONS_BASE}/${id}`),

  create: (data: CreateTransactionRequest) =>
    apiClient.post<SingleResponse<Transaction>>(TRANSACTIONS_BASE, data),

  update: (id: string, data: UpdateTransactionRequest) =>
    apiClient.patch<SingleResponse<Transaction>>(
      `${TRANSACTIONS_BASE}/${id}`,
      data
    ),

  delete: (id: string) =>
    apiClient.delete<MessageOnlyResponse>(`${TRANSACTIONS_BASE}/${id}`),
}
