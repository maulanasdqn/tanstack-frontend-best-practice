import { apiClient } from '@/libs/axios'
import type { TSingleResponse, TMessageOnlyResponse } from '../types'
import type {
  TLoginRequest,
  TLoginData,
  TRegisterRequest,
  TRegisterData,
  TVerifyEmailRequest,
  TRefreshTokenRequest,
  TRefreshTokenData,
  TLogoutRequest,
  TRequestPasswordResetRequest,
  TResetPasswordRequest,
  TChangePasswordRequest,
  TEnable2FAData,
  TVerify2FARequest,
  TDisable2FARequest,
  TGoogleOAuthCallbackRequest,
  TGoogleOAuthData,
} from './types'

const AUTH_BASE = '/api/v1/auth'

export const authService = {
  login: (data: TLoginRequest) =>
    apiClient.post<TSingleResponse<TLoginData>>(`${AUTH_BASE}/login`, data),

  register: (data: TRegisterRequest) =>
    apiClient.post<TSingleResponse<TRegisterData>>(`${AUTH_BASE}/register`, data),

  verifyEmail: (data: TVerifyEmailRequest) =>
    apiClient.post<TMessageOnlyResponse>(`${AUTH_BASE}/verify-email`, data),

  refreshToken: (data: TRefreshTokenRequest) =>
    apiClient.post<TSingleResponse<TRefreshTokenData>>(
      `${AUTH_BASE}/refresh`,
      data
    ),

  logout: (data: TLogoutRequest) =>
    apiClient.post<TMessageOnlyResponse>(`${AUTH_BASE}/logout`, data),

  logoutAll: () =>
    apiClient.post<TMessageOnlyResponse>(`${AUTH_BASE}/logout-all`),

  requestPasswordReset: (data: TRequestPasswordResetRequest) =>
    apiClient.post<TMessageOnlyResponse>(
      `${AUTH_BASE}/request-password-reset`,
      data
    ),

  resetPassword: (data: TResetPasswordRequest) =>
    apiClient.post<TMessageOnlyResponse>(`${AUTH_BASE}/reset-password`, data),

  changePassword: (data: TChangePasswordRequest) =>
    apiClient.post<TMessageOnlyResponse>(`${AUTH_BASE}/change-password`, data),

  enable2FA: () =>
    apiClient.post<TSingleResponse<TEnable2FAData>>(`${AUTH_BASE}/2fa/enable`),

  verify2FA: (data: TVerify2FARequest) =>
    apiClient.post<TMessageOnlyResponse>(`${AUTH_BASE}/2fa/verify`, data),

  disable2FA: (data: TDisable2FARequest) =>
    apiClient.post<TMessageOnlyResponse>(`${AUTH_BASE}/2fa/disable`, data),

  getGoogleAuthUrl: () =>
    apiClient.get<TSingleResponse<{ url: string }>>(`${AUTH_BASE}/google`),

  googleCallback: (data: TGoogleOAuthCallbackRequest) =>
    apiClient.post<TSingleResponse<TGoogleOAuthData>>(
      `${AUTH_BASE}/google/callback`,
      data
    ),
}
