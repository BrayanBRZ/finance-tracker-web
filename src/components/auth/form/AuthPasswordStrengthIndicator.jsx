import { cn } from '@/lib/utils'
import { evaluatePasswordStrength } from '@/utils/calculateStrength'

const strengthClasses = {
  weak: 'bg-destructive',
  medium: 'bg-warning',
  strong: 'bg-success',
}

const strengthTextClasses = {
  weak: 'text-destructive',
  medium: 'text-warning',
  strong: 'text-success',
}

export function AuthPasswordStrengthIndicator({ password, className }) {
  if (!password) return null

  const strength = evaluatePasswordStrength(password)

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`Força da senha: ${strength.label}`}
      className={cn('flex items-center gap-2', className)}
    >
      <span
        className={cn(
          'text-xs font-medium',
          strengthTextClasses[strength.level],
        )}
      >
        {strength.label}
      </span>
      <span className="flex items-center gap-1" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, index) => (
          <span
            key={index}
            className={cn(
              'h-1 w-3 rounded-full transition-colors',
              index < strength.score
                ? strengthClasses[strength.level]
                : 'bg-muted',
            )}
          />
        ))}
      </span>
    </div>
  )
}
