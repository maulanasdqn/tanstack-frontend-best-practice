import type { FieldProps, SelectOption } from './types'
import { FieldWrapper } from './field-wrapper'

type SelectFieldProps = FieldProps & {
  options: SelectOption[]
}

export function SelectField({
  field,
  label,
  placeholder,
  disabled,
  className,
  helperText,
  options,
}: SelectFieldProps) {
  return (
    <FieldWrapper field={field} label={label} helperText={helperText}>
      <select
        id={field.name}
        name={field.name}
        value={(field.state.value as string) ?? ''}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        disabled={disabled}
        className={className}
        aria-invalid={field.state.meta.errors.length > 0}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  )
}
