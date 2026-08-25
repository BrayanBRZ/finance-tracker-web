export const PASSWORD_MIN_LENGTH = 8

export const PASSWORD_REQUIREMENTS = Object.freeze([
  {
    key: 'length',
    label: `Pelo menos ${PASSWORD_MIN_LENGTH} caracteres`,
    test: (password) => password.length >= PASSWORD_MIN_LENGTH,
  },
  {
    key: 'lowercase',
    label: 'Uma letra minúscula',
    test: (password) => /[a-z]/.test(password),
  },
  {
    key: 'uppercase',
    label: 'Uma letra maiúscula',
    test: (password) => /[A-Z]/.test(password),
  },
  {
    key: 'number',
    label: 'Um número',
    test: (password) => /[0-9]/.test(password),
  },
  {
    key: 'symbol',
    label: 'Um símbolo',
    test: (password) => /[^a-zA-Z0-9]/.test(password),
  },
])

export const PASSWORD_MIN_MESSAGE = 'Use pelo menos 8 caracteres'

export function evaluatePasswordRequirements(password = '') {
  return PASSWORD_REQUIREMENTS.map((requirement) => ({
    key: requirement.key,
    label: requirement.label,
    passed: requirement.test(password),
  }))
}

export function isValidPassword(password = '') {
  return password.length >= PASSWORD_MIN_LENGTH
}
