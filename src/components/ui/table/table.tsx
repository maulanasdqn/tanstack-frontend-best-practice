import { type ReactNode } from 'react'

type TableProps = {
  children: ReactNode
}

export function Table({ children }: TableProps) {
  return (
    <table className="min-w-full divide-y divide-gray-200">{children}</table>
  )
}

export function TableHead({ children }: TableProps) {
  return <thead className="bg-gray-50">{children}</thead>
}

export function TableBody({ children }: TableProps) {
  return <tbody className="divide-y divide-gray-200 bg-white">{children}</tbody>
}

export function TableRow({ children }: TableProps) {
  return <tr>{children}</tr>
}

type TableHeaderProps = {
  children: ReactNode
  align?: 'left' | 'right' | 'center'
}

export function TableHeader({ children, align = 'left' }: TableHeaderProps) {
  const alignClass = {
    left: 'text-left',
    right: 'text-right',
    center: 'text-center',
  }[align]

  return (
    <th
      className={`px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 ${alignClass}`}
    >
      {children}
    </th>
  )
}

type TableCellProps = {
  children: ReactNode
  align?: 'left' | 'right' | 'center'
  className?: string
}

export function TableCell({
  children,
  align = 'left',
  className = '',
}: TableCellProps) {
  const alignClass = {
    left: 'text-left',
    right: 'text-right',
    center: 'text-center',
  }[align]

  return (
    <td className={`whitespace-nowrap px-6 py-4 ${alignClass} ${className}`}>
      {children}
    </td>
  )
}
