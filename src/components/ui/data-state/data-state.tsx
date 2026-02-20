import { type ReactNode } from 'react'

type DataStateProps<T> = {
  data: T[] | undefined
  isLoading: boolean
  error: Error | null
  loadingText?: string
  errorText?: string
  emptyText?: string
  children: (data: T[]) => ReactNode
}

export function DataState<T>({
  data,
  isLoading,
  error,
  loadingText = 'Loading...',
  errorText = 'An error occurred',
  emptyText = 'No data found',
  children,
}: DataStateProps<T>) {
  if (isLoading) {
    return <p className="p-6 text-gray-500">{loadingText}</p>
  }

  if (error) {
    return <p className="p-6 text-red-500">{errorText}</p>
  }

  if (!data || data.length === 0) {
    return <p className="p-6 text-gray-500">{emptyText}</p>
  }

  return <>{children(data)}</>
}
