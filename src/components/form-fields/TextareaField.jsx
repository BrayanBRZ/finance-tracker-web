import { ErrorSpan } from '@/components/form-fields/ErrorSpan'
import { Field, FieldLabel } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'

export function TextareaField({
  id,
  label,
  error,
  textareaClassName,
  ...props
}) {
  const errorId = `${id}-error`

  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Textarea
        id={id}
        className={textareaClassName}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      <ErrorSpan id={errorId} error={error} />
    </Field>
  )
}
