import type { ReactNode } from 'react'
import type { AnyFieldApi } from '@tanstack/react-form'

export type FieldProps = {
  field: AnyFieldApi
  label?: string
  placeholder?: string
  disabled?: boolean
  className?: string
  helperText?: ReactNode
}

export type SelectOption = {
  value: string
  label: string
}
