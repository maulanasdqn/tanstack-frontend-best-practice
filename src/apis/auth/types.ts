// Auth API Types

export type User = {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  created_at: string
  updated_at: string
}

export type TokenData = {
  access_token: string
  refresh_token: string
}

export type LoginData = {
  token: TokenData
  user: User
  requires_2fa: boolean
}

export type RegisterData = {
  user_id: string
}

export type RefreshTokenData = {
  access_token: string
}

export type Enable2FAData = {
  secret: string
  qr_code_svg: string
  provisioning_uri: string
}

export type GoogleOAuthData = {
  access_token: string
  refresh_token: string
  is_new_user: boolean
}

// Request Types
export type LoginRequest = {
  email: string
  password: string
}

export type RegisterRequest = {
  email: string
  password: string
  first_name?: string
  last_name?: string
}

export type VerifyEmailRequest = {
  user_id: string
  otp_code: string
}

export type RefreshTokenRequest = {
  refresh_token: string
}

export type LogoutRequest = {
  refresh_token: string
}

export type RequestPasswordResetRequest = {
  email: string
}

export type ResetPasswordRequest = {
  token: string
  new_password: string
}

export type ChangePasswordRequest = {
  current_password: string
  new_password: string
}

export type Verify2FARequest = {
  code: string
  enable_on_success?: boolean
}

export type Disable2FARequest = {
  password: string
  code: string
}

export type GoogleOAuthCallbackRequest = {
  code: string
}
