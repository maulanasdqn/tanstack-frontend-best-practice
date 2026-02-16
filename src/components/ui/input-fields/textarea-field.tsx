import type { FieldProps } from './types'
import { FieldWrapper } from './field-wrapper'

type TextAreaFieldProps = FieldProps & {
  rows?: number
}

export function TextAreaField({
  field,
  label,
  placeholder,
  disabled,
  className,
  helperText,
  rows = 4,
}: TextAreaFieldProps) {
  return (
    <FieldWrapper field={field} label={label} helperText={helperText}>
      <textarea
        id={field.name}
        name={field.name}
        value={(field.state.value as string) ?? ''}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={className}
        rows={rows}
        aria-invalid={field.state.meta.errors.length > 0}
      />
    </FieldWrapper>
  )
}
