import { forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const PasswordInput = forwardRef(({ className, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative">
      <Input
        type={showPassword ? 'text' : 'password'}
        className={cn('pr-10', className)}
        ref={ref}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShowPassword((current) => !current)}
        aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
        className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer rounded-sm p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
      >
        {showPassword ? (
          <EyeOff size={20} strokeWidth={1.5} />
        ) : (
          <Eye size={20} strokeWidth={1.5} />
        )}
      </button>
    </div>
  )
})

PasswordInput.displayName = 'PasswordInput'

export { PasswordInput }
