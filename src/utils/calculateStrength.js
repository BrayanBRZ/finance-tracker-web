import { evaluatePasswordRequirements } from '@/domain/passwordPolicy'

export function evaluatePasswordStrength(password = '') {
  const criteria = evaluatePasswordRequirements(password)
  const score = criteria.filter((criterion) => criterion.passed).length

  if (!password) {
    return { score, level: 'empty', label: '', criteria }
  }

  if (score <= 2) {
    return { score, level: 'weak', label: 'Fraca', criteria }
  }

  if (score <= 4) {
    return { score, level: 'medium', label: 'Média', criteria }
  }

  return { score, level: 'strong', label: 'Forte', criteria }
}
