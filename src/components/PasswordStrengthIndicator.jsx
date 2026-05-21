import { evaluatePasswordStrength } from '@/utils/calculateStrength'

const PasswordStrengthIndicator = ({ password }) => {
  if (!password) return null

  let strength = evaluatePasswordStrength(password)
  const BARS = 5

  return (
    <div className="flex gap-1.5 items-center pt-4 pr-1">
      {Array.from({ length: BARS }).map((_, i) => (
        <div
          key={i}
          className={`w-3 h-1 rounded-2xl transition-all duration-300 ${i < strength.score ? strength.color : 'bg-zinc-200'
            }`}
        />
      ))}
    </div>
  )
}

export { PasswordStrengthIndicator }