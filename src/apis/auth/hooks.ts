import { useMutation, useQueryClient } from '@/libs/tanstack-query'
import { authService } from './service'
import { useAuthStore } from './store'
import type {
  TLoginRequest,
  TRegisterRequest,
  TVerifyEmailRequest,
  TRequestPasswordResetRequest,
  TResetPasswordRequest,
  TChangePasswordRequest,
  TVerify2FARequest,
  TDisable2FARequest,
  TGoogleOAuthCallbackRequest,
} from './types'

export function useLogin() {
  const { setAuth, setTokens } = useAuthStore()

  return useMutation({
    mutationFn: (data: TLoginRequest) => authService.login(data),
    onSuccess: (response) => {
      const { token, user, requires_2fa } = response.data.data
      if (!requires_2fa) {
        setTokens(token.access_token, token.refresh_token)
        setAuth(user)
      }
    },
  })
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: TRegisterRequest) => authService.register(data),
  })
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (data: TVerifyEmailRequest) => authService.verifyEmail(data),
  })
}

export function useLogout() {
  const { clearAuth, refreshToken } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => {
      if (!refreshToken) {
        return Promise.resolve({
          data: { message: 'Logged out', version: '1.0' },
        })
      }
      return authService.logout({ refresh_token: refreshToken })
    },
    onSuccess: () => {
      clearAuth()
      queryClient.clear()
    },
    onError: () => {
      clearAuth()
      queryClient.clear()
    },
  })
}

export function useLogoutAll() {
  const { clearAuth } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authService.logoutAll(),
    onSuccess: () => {
      clearAuth()
      queryClient.clear()
    },
  })
}

export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: (data: TRequestPasswordResetRequest) =>
      authService.requestPasswordReset(data),
  })
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (data: TResetPasswordRequest) => authService.resetPassword(data),
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: TChangePasswordRequest) =>
      authService.changePassword(data),
  })
}

export function useEnable2FA() {
  return useMutation({
    mutationFn: () => authService.enable2FA(),
  })
}

export function useVerify2FA() {
  return useMutation({
    mutationFn: (data: TVerify2FARequest) => authService.verify2FA(data),
  })
}

export function useDisable2FA() {
  return useMutation({
    mutationFn: (data: TDisable2FARequest) => authService.disable2FA(data),
  })
}

export function useGoogleAuth() {
  const { setTokens } = useAuthStore()

  return {
    getAuthUrl: useMutation({
      mutationFn: () => authService.getGoogleAuthUrl(),
    }),
    callback: useMutation({
      mutationFn: (data: TGoogleOAuthCallbackRequest) =>
        authService.googleCallback(data),
      onSuccess: (response) => {
        const { access_token, refresh_token } = response.data.data
        setTokens(access_token, refresh_token)
      },
    }),
  }
}
