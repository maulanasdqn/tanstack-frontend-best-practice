import { useMutation, useQueryClient } from '@/libs/tanstack-query'
import { authService } from './service'
import { useAuthStore } from './store'
import type {
  LoginRequest,
  RegisterRequest,
  VerifyEmailRequest,
  RequestPasswordResetRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  Verify2FARequest,
  Disable2FARequest,
  GoogleOAuthCallbackRequest,
} from './types'

export function useLogin() {
  const { setAuth, setTokens } = useAuthStore()

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
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
    mutationFn: (data: RegisterRequest) => authService.register(data),
  })
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (data: VerifyEmailRequest) => authService.verifyEmail(data),
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
      // Clear auth even if logout request fails
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
    mutationFn: (data: RequestPasswordResetRequest) =>
      authService.requestPasswordReset(data),
  })
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => authService.resetPassword(data),
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) =>
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
    mutationFn: (data: Verify2FARequest) => authService.verify2FA(data),
  })
}

export function useDisable2FA() {
  return useMutation({
    mutationFn: (data: Disable2FARequest) => authService.disable2FA(data),
  })
}

export function useGoogleAuth() {
  const { setTokens } = useAuthStore()

  return {
    getAuthUrl: useMutation({
      mutationFn: () => authService.getGoogleAuthUrl(),
    }),
    callback: useMutation({
      mutationFn: (data: GoogleOAuthCallbackRequest) =>
        authService.googleCallback(data),
      onSuccess: (response) => {
        const { access_token, refresh_token } = response.data.data
        setTokens(access_token, refresh_token)
        // Note: User data would need to be fetched separately after OAuth
      },
    }),
  }
}
