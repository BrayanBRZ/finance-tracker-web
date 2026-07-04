import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { ErrorSpan } from '@/components/form-fields/ErrorSpan'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export function FormPasswordField({
  id,
  label,
  error,
  labelAddon,
  className,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false)
  const errorId = `${id}-error`

  return (
    <Field>
      <div className="flex justify-between">
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        {labelAddon}
      </div>

      <div className="relative">
        <Input
          id={id}
          type={showPassword ? 'text' : 'password'}
          className={cn('h-10 pr-10', className)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          {...props}
        />
        <div className="absolute top-0 right-1 flex h-full items-center">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowPassword((current) => !current)}
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            className="cursor-pointer rounded-sm text-muted-foreground focus:outline-none hover:bg-transparent"
          >
            {showPassword ? (
              <EyeOff className="size-4" strokeWidth={1.5} />
            ) : (
              <Eye className="size-4" strokeWidth={1.5} />
            )}
          </Button>
        </div>
      </div>

      <ErrorSpan id={errorId} error={error} />
    </Field>
  )
}
