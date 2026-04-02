import { Store } from '@tanstack/store'
import { useStore } from '@tanstack/react-store'
import type { TUser } from './types'

type TAuthState = {
  user: TUser | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
}

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
} as const

function getInitialState(): TAuthState {
  if (typeof window === 'undefined') {
    return {
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    }
  }

  const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
  const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
  const userStr = localStorage.getItem(STORAGE_KEYS.USER)
  const user = userStr ? (JSON.parse(userStr) as TUser) : null

  return {
    user,
    accessToken,
    refreshToken,
    isAuthenticated: !!accessToken && !!user,
  }
}

export const authStore = new Store<TAuthState>(getInitialState())

export const authActions = {
  setAuth: (user: TUser) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
    authStore.setState((state) => ({
      ...state,
      user,
      isAuthenticated: !!state.accessToken,
    }))
  },

  setTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
    localStorage.setItem('token', accessToken)
    authStore.setState((state) => ({
      ...state,
      accessToken,
      refreshToken,
      isAuthenticated: !!state.user,
    }))
  },

  updateAccessToken: (accessToken: string) => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
    localStorage.setItem('token', accessToken)
    authStore.setState((state) => ({
      ...state,
      accessToken,
    }))
  },

  clearAuth: () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)
    localStorage.removeItem('token')
    authStore.setState(() => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    }))
  },
}

export function useAuthStore() {
  const state = useStore(authStore)

  return {
    ...state,
    setAuth: authActions.setAuth,
    setTokens: authActions.setTokens,
    updateAccessToken: authActions.updateAccessToken,
    clearAuth: authActions.clearAuth,
  }
}

export function useUser() {
  return useStore(authStore, (state) => state.user)
}

export function useIsAuthenticated() {
  return useStore(authStore, (state) => state.isAuthenticated)
}
