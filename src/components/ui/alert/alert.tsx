import { type ReactNode } from 'react'

type AlertVariant = 'info' | 'success' | 'warning' | 'error'

type AlertProps = {
  variant?: AlertVariant
  children: ReactNode
  className?: string
}

const variantStyles: Record<AlertVariant, string> = {
  info: 'bg-blue-50 text-blue-700',
  success: 'bg-green-50 text-green-700',
  warning: 'bg-yellow-50 text-yellow-700',
  error: 'bg-red-50 text-red-700',
}

export function Alert({
  variant = 'info',
  children,
  className = '',
}: AlertProps) {
  return (
    <div className={`rounded-md p-4 ${variantStyles[variant]} ${className}`}>
      <p className="text-sm">{children}</p>
    </div>
  )
}
