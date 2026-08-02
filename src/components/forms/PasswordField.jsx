import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { ErrorSpan } from '@/components/forms/ErrorSpan'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export function PasswordField({
  id,
  label,
  error,
  labelAddon,
  inputClassName,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false)
  const errorId = `${id}-error`

  return (
    <Field>
      <div className="flex items-center justify-between gap-2">
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        {labelAddon}
      </div>

      <div className="relative">
        <Input
          id={id}
          type={showPassword ? 'text' : 'password'}
          className={cn('pr-10', inputClassName)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword((current) => !current)}
          aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          className="absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer rounded-(--radius) p-0.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
        >
          {showPassword ? (
            <EyeOff className="size-4" strokeWidth={1.5} />
          ) : (
            <Eye className="size-4" strokeWidth={1.5} />
          )}
        </button>
      </div>

      <ErrorSpan id={errorId} error={error} />
    </Field>
  )
}
