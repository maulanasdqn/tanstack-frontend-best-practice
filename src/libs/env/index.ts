export const env = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  APP_NAME: import.meta.env.VITE_APP_NAME,
  APP_ENV: import.meta.env.VITE_APP_ENV,
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
} as const

export function getEnv<K extends keyof typeof env>(key: K): (typeof env)[K] {
  return env[key]
}
