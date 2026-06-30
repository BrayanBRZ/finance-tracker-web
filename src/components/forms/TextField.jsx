import { ErrorSpan } from '@/components/forms/ErrorSpan'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

export function TextField({
  id,
  label,
  error,
  type = 'text',
  inputClassName,
  ...props
}) {
  const errorId = `${id}-error`

  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        id={id}
        type={type}
        className={inputClassName}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      <ErrorSpan id={errorId} error={error} />
    </Field>
  )
}
