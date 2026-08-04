import { PasswordField } from '@/components/form-fields/PasswordField'
import { cn } from '@/lib/utils'

const authInputClassName = 'h-10 px-2.5 py-1.5 text-sm'

export function AuthPasswordField({ inputClassName, ...props }) {
  return (
    <PasswordField
      inputClassName={cn(authInputClassName, inputClassName)}
      {...props}
    />
  )
}
