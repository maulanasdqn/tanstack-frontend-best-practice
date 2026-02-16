import type { ReactNode } from 'react'
import type { AnyFieldApi } from '@tanstack/react-form'

type FieldWrapperProps = {
  field: AnyFieldApi
  label?: string
  helperText?: ReactNode
  children: ReactNode
}

export function FieldWrapper({
  field,
  label,
  helperText,
  children,
}: FieldWrapperProps) {
  const errors = field.state.meta.errors

  return (
    <div className="field-wrapper">
      {label && (
        <label htmlFor={field.name} className="field-label">
          {label}
        </label>
      )}
      {children}
      {helperText && !errors.length && (
        <span className="field-helper">{helperText}</span>
      )}
      {errors.length > 0 && (
        <span className="field-error">
          {errors
            .map((error) =>
              typeof error === 'string'
                ? error
                : (error as { message?: string })?.message || ''
            )
            .filter(Boolean)
            .join(', ')}
        </span>
      )}
    </div>
  )
}
