export type TUser = {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  created_at: string
  updated_at: string
}

export type TTokenData = {
  access_token: string
  refresh_token: string
}

export type TLoginData = {
  token: TTokenData
  user: TUser
  requires_2fa: boolean
}

export type TRegisterData = {
  user_id: string
}

export type TRefreshTokenData = {
  access_token: string
}

export type TEnable2FAData = {
  secret: string
  qr_code_svg: string
  provisioning_uri: string
}

export type TGoogleOAuthData = {
  access_token: string
  refresh_token: string
  is_new_user: boolean
}

export type TLoginRequest = {
  email: string
  password: string
}

export type TRegisterRequest = {
  email: string
  password: string
  first_name?: string
  last_name?: string
}

export type TVerifyEmailRequest = {
  user_id: string
  otp_code: string
}

export type TRefreshTokenRequest = {
  refresh_token: string
}

export type TLogoutRequest = {
  refresh_token: string
}

export type TRequestPasswordResetRequest = {
  email: string
}

export type TResetPasswordRequest = {
  token: string
  new_password: string
}

export type TChangePasswordRequest = {
  current_password: string
  new_password: string
}

export type TVerify2FARequest = {
  code: string
  enable_on_success?: boolean
}

export type TDisable2FARequest = {
  password: string
  code: string
}

export type TGoogleOAuthCallbackRequest = {
  code: string
}
