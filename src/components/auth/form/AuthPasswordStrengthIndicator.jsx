import { evaluatePasswordStrength } from '@/utils/calculateStrength'
import { cn } from '@/lib/utils'

const strengthClasses = {
  1: 'bg-destructive',
  2: 'bg-destructive',
  3: 'bg-primary/60',
  4: 'bg-primary/80',
  5: 'bg-primary',
}

export function AuthPasswordStrengthIndicator({ password, className }) {
  if (!password) {
    return null
  }

  const strength = evaluatePasswordStrength(password)
  const bars = 5

  return (
    <div className={cn('flex items-center gap-1 pt-3 pr-1', className)}>
      {Array.from({ length: bars }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'h-1 w-3 rounded-(--radius) transition-all duration-300',
            index < strength.score
              ? strengthClasses[strength.score]
              : 'bg-muted',
          )}
        />
      ))}
    </div>
  )
}
