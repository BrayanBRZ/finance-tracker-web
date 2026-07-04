import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { ErrorSpan } from '@/components/form-fields/ErrorSpan'
import { cn } from '@/lib/utils'

export function FormInputField({
  id,
  label,
  type,
  error,
  className,
  ...props
}) {
  const errorId = `${id}-error`

  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        id={id}
        type={type ? type : "text"}
        className={cn('h-10 pr-10', className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      <ErrorSpan id={errorId} error={error} />
    </Field>
  )
}
