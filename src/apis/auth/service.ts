import { apiClient } from '@/libs/axios'
import type { SingleResponse, MessageOnlyResponse } from '../types'
import type {
  LoginRequest,
  LoginData,
  RegisterRequest,
  RegisterData,
  VerifyEmailRequest,
  RefreshTokenRequest,
  RefreshTokenData,
  LogoutRequest,
  RequestPasswordResetRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  Enable2FAData,
  Verify2FARequest,
  Disable2FARequest,
  GoogleOAuthCallbackRequest,
  GoogleOAuthData,
} from './types'

const AUTH_BASE = '/api/v1/auth'

export const authService = {
  // Authentication
  login: (data: LoginRequest) =>
    apiClient.post<SingleResponse<LoginData>>(`${AUTH_BASE}/login`, data),

  register: (data: RegisterRequest) =>
    apiClient.post<SingleResponse<RegisterData>>(`${AUTH_BASE}/register`, data),

  verifyEmail: (data: VerifyEmailRequest) =>
    apiClient.post<MessageOnlyResponse>(`${AUTH_BASE}/verify-email`, data),

  refreshToken: (data: RefreshTokenRequest) =>
    apiClient.post<SingleResponse<RefreshTokenData>>(
      `${AUTH_BASE}/refresh`,
      data
    ),

  logout: (data: LogoutRequest) =>
    apiClient.post<MessageOnlyResponse>(`${AUTH_BASE}/logout`, data),

  logoutAll: () =>
    apiClient.post<MessageOnlyResponse>(`${AUTH_BASE}/logout-all`),

  // Password Management
  requestPasswordReset: (data: RequestPasswordResetRequest) =>
    apiClient.post<MessageOnlyResponse>(
      `${AUTH_BASE}/request-password-reset`,
      data
    ),

  resetPassword: (data: ResetPasswordRequest) =>
    apiClient.post<MessageOnlyResponse>(`${AUTH_BASE}/reset-password`, data),

  changePassword: (data: ChangePasswordRequest) =>
    apiClient.post<MessageOnlyResponse>(`${AUTH_BASE}/change-password`, data),

  // Two-Factor Authentication
  enable2FA: () =>
    apiClient.post<SingleResponse<Enable2FAData>>(`${AUTH_BASE}/2fa/enable`),

  verify2FA: (data: Verify2FARequest) =>
    apiClient.post<MessageOnlyResponse>(`${AUTH_BASE}/2fa/verify`, data),

  disable2FA: (data: Disable2FARequest) =>
    apiClient.post<MessageOnlyResponse>(`${AUTH_BASE}/2fa/disable`, data),

  // Google OAuth
  getGoogleAuthUrl: () =>
    apiClient.get<SingleResponse<{ url: string }>>(`${AUTH_BASE}/google`),

  googleCallback: (data: GoogleOAuthCallbackRequest) =>
    apiClient.post<SingleResponse<GoogleOAuthData>>(
      `${AUTH_BASE}/google/callback`,
      data
    ),
}
