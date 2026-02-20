import { useQuery, useMutation, useQueryClient } from '@/libs/tanstack-query'
import { budgetsService, type ListBudgetsParams } from './service'
import type { CreateBudgetRequest, UpdateBudgetRequest } from './types'

export const budgetKeys = {
  all: ['budgets'] as const,
  lists: () => [...budgetKeys.all, 'list'] as const,
  list: (params?: ListBudgetsParams) =>
    [...budgetKeys.lists(), params] as const,
  details: () => [...budgetKeys.all, 'detail'] as const,
  detail: (id: string) => [...budgetKeys.details(), id] as const,
}

export function useBudgets(params?: ListBudgetsParams) {
  return useQuery({
    queryKey: budgetKeys.list(params),
    queryFn: () => budgetsService.list(params).then((res) => res.data),
  })
}

export function useBudget(id: string) {
  return useQuery({
    queryKey: budgetKeys.detail(id),
    queryFn: () => budgetsService.get(id).then((res) => res.data),
    enabled: !!id,
  })
}

export function useCreateBudget() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateBudgetRequest) => budgetsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.lists() })
    },
  })
}

export function useUpdateBudget() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBudgetRequest }) =>
      budgetsService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.lists() })
      queryClient.invalidateQueries({ queryKey: budgetKeys.detail(id) })
    },
  })
}

export function useDeleteBudget() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => budgetsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.lists() })
    },
  })
}

export function useDeactivateBudget() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => budgetsService.deactivate(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.lists() })
      queryClient.invalidateQueries({ queryKey: budgetKeys.detail(id) })
    },
  })
}
