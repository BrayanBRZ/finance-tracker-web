import { createMockId } from '@/mocks/utils/createMockId'

const normalizeEmail = (email) => email.trim().toLowerCase()

export function createUser({ name, email, password }) {
  return {
    id: createMockId(),
    name: name.trim(),
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
