import { evaluatePasswordStrength } from '@/utils/calculateStrength'
import { cn } from '@/lib/utils'

const strengthClasses = {
  1: 'bg-destructive',
  2: 'bg-destructive',
  3: 'bg-primary/60',
  4: 'bg-primary/80',
  5: 'bg-primary',
}

export function PasswordStrengthIndicator({ password }) {
  if (!password) {
    return null
  }

  const strength = evaluatePasswordStrength(password)
  const bars = 5

  return (
    <div className="flex items-center gap-1.5 pt-4 pr-1">
      {Array.from({ length: bars }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'h-1 w-3 rounded-2xl transition-all duration-300',
            index < strength.score
              ? strengthClasses[strength.score]
              : 'bg-muted',
          )}
        />
      ))}
    </div>
  )
}
