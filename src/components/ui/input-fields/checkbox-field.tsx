import type { FieldProps } from './types'

type CheckboxFieldProps = Omit<FieldProps, 'placeholder'>

export function CheckboxField({
  field,
  label,
  disabled,
  className,
  helperText,
}: CheckboxFieldProps) {
  const errors = field.state.meta.errors

  return (
    <div className="field-wrapper field-wrapper--checkbox">
      <label className="checkbox-label">
        <input
          id={field.name}
          name={field.name}
          type="checkbox"
          checked={(field.state.value as boolean) ?? false}
          onChange={(e) => field.handleChange(e.target.checked)}
          onBlur={field.handleBlur}
          disabled={disabled}
          className={className}
          aria-invalid={errors.length > 0}
        />
        {label && <span>{label}</span>}
      </label>
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
