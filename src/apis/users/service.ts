import { apiClient } from '@/libs/axios'
import type {
  SingleResponse,
  ListResponse,
  MessageOnlyResponse,
  PaginationParams,
} from '../types'
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UserFilters,
} from './types'

const USERS_BASE = '/api/v1/users'

export type ListUsersParams = PaginationParams & UserFilters

export const usersService = {
  list: (params?: ListUsersParams) =>
    apiClient.get<ListResponse<User>>(USERS_BASE, { params }),

  get: (id: string) =>
    apiClient.get<SingleResponse<User>>(`${USERS_BASE}/${id}`),

  create: (data: CreateUserRequest) =>
    apiClient.post<SingleResponse<User>>(USERS_BASE, data),

  update: (id: string, data: UpdateUserRequest) =>
    apiClient.patch<SingleResponse<User>>(`${USERS_BASE}/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<MessageOnlyResponse>(`${USERS_BASE}/${id}`),
}
