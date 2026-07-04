export function evaluatePasswordStrength(password) {
  if (!password)
    return { score: 0, label: '', color: '', textColor: '', criteria: [] }

  const criteria = [
    { test: password.length >= 6 },
    { test: /[a-z]/.test(password) },
    { test: /[A-Z]/.test(password) },
    { test: /[0-9]/.test(password) },
    { test: /[^a-zA-Z0-9]/.test(password) },
  ]

  const score = criteria.filter((c) => c.test).length

  const config = [
    { color: '', textColor: '' },
    { color: 'bg-red-500', textColor: 'text-red-500' },
    { color: 'bg-orange-400', textColor: 'text-orange-400' },
    { color: 'bg-amber-400', textColor: 'text-amber-500' },
    { color: 'bg-lime-500', textColor: 'text-lime-600' },
    { color: 'bg-green-500', textColor: 'text-green-600' },
  ]

  return { score, ...config[score] }
}
