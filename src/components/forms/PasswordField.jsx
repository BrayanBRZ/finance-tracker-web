import { ErrorSpan } from '@/components/forms/ErrorSpan'
import { PasswordInput } from '@/components/forms/PasswordInput'
import { Field, FieldLabel } from '@/components/ui/field'

export function PasswordField({
  id,
  label,
  error,
  labelAddon,
  inputClassName,
  ...props
}) {
  const errorId = `${id}-error`

  return (
    <Field>
      <div className="flex justify-between">
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        {labelAddon}
      </div>
      <PasswordInput
        id={id}
        className={inputClassName}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      <ErrorSpan id={errorId} error={error} />
    </Field>
  )
}
