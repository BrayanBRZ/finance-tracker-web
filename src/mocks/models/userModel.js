import { createMockId } from '@/mocks/utils/createMockId'
import { normalizeEmail, normalizeRequiredText } from '@/mocks/utils/text'

export function createUser({ name, email, password }) {
  return {
    id: createMockId(),
    name: normalizeRequiredText(name),
    email: normalizeEmail(email),
    password,
  }
}

export function toPublicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  }
}

export function isSameEmail(leftEmail, rightEmail) {
  return normalizeEmail(leftEmail) === normalizeEmail(rightEmail)
}
