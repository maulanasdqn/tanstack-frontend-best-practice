import { type ReactNode } from 'react'

type CardProps = {
  children: ReactNode
  className?: string
  padding?: boolean
}

export function Card({ children, className = '', padding = true }: CardProps) {
  return (
    <div
      className={`rounded-lg bg-white shadow ${padding ? 'p-6' : ''} ${className}`}
    >
      {children}
    </div>
  )
}

type CardHeaderProps = {
  title: string
  children?: ReactNode
}

export function CardHeader({ title, children }: CardHeaderProps) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {children}
    </div>
  )
}
