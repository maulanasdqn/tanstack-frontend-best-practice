import type { FieldProps } from './types'
import { FieldWrapper } from './field-wrapper'

type TextFieldProps = FieldProps & {
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'number'
}

export function TextField({
  field,
  label,
  placeholder,
  disabled,
  className,
  helperText,
  type = 'text',
}: TextFieldProps) {
  return (
    <FieldWrapper field={field} label={label} helperText={helperText}>
      <input
        id={field.name}
        name={field.name}
        type={type}
        value={(field.state.value as string) ?? ''}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={className}
        aria-invalid={field.state.meta.errors.length > 0}
      />
    </FieldWrapper>
  )
}
