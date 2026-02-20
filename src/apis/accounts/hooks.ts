import { useQuery, useMutation, useQueryClient } from '@/libs/tanstack-query'
import { accountsService, type ListAccountsParams } from './service'
import type { CreateAccountRequest, UpdateAccountRequest } from './types'

export const accountKeys = {
  all: ['accounts'] as const,
  lists: () => [...accountKeys.all, 'list'] as const,
  list: (params?: ListAccountsParams) =>
    [...accountKeys.lists(), params] as const,
  details: () => [...accountKeys.all, 'detail'] as const,
  detail: (id: string) => [...accountKeys.details(), id] as const,
}

export function useAccounts(params?: ListAccountsParams) {
  return useQuery({
    queryKey: accountKeys.list(params),
    queryFn: () => accountsService.list(params).then((res) => res.data),
  })
}

export function useAccount(id: string) {
  return useQuery({
    queryKey: accountKeys.detail(id),
    queryFn: () => accountsService.get(id).then((res) => res.data),
    enabled: !!id,
  })
}

export function useCreateAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateAccountRequest) => accountsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() })
    },
  })
}

export function useUpdateAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAccountRequest }) =>
      accountsService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() })
      queryClient.invalidateQueries({ queryKey: accountKeys.detail(id) })
    },
  })
}

export function useDeleteAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => accountsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() })
    },
  })
}

export function useDeactivateAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => accountsService.deactivate(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() })
      queryClient.invalidateQueries({ queryKey: accountKeys.detail(id) })
    },
  })
}
