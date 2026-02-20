import { useQuery, useMutation, useQueryClient } from '@/libs/tanstack-query'
import { transactionsService, type ListTransactionsParams } from './service'
import type {
  CreateTransactionRequest,
  UpdateTransactionRequest,
} from './types'
import { accountKeys } from '../accounts/hooks'

export const transactionKeys = {
  all: ['transactions'] as const,
  lists: () => [...transactionKeys.all, 'list'] as const,
  list: (params?: ListTransactionsParams) =>
    [...transactionKeys.lists(), params] as const,
  details: () => [...transactionKeys.all, 'detail'] as const,
  detail: (id: string) => [...transactionKeys.details(), id] as const,
}

export function useTransactions(params?: ListTransactionsParams) {
  return useQuery({
    queryKey: transactionKeys.list(params),
    queryFn: () => transactionsService.list(params).then((res) => res.data),
  })
}

export function useTransaction(id: string) {
  return useQuery({
    queryKey: transactionKeys.detail(id),
    queryFn: () => transactionsService.get(id).then((res) => res.data),
    enabled: !!id,
  })
}

export function useCreateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTransactionRequest) =>
      transactionsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() })
      // Transactions affect account balances
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() })
    },
  })
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: UpdateTransactionRequest
    }) => transactionsService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() })
      queryClient.invalidateQueries({ queryKey: transactionKeys.detail(id) })
    },
  })
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => transactionsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() })
      // Transactions affect account balances
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() })
    },
  })
}
