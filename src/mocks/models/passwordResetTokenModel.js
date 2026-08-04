import { createMockId } from '@/mocks/utils/createMockId'
import { createIsoTimestamp } from '@/mocks/utils/date'

const RESET_TOKEN_DURATION_IN_MS = 1000 * 60 * 60

export function createPasswordResetToken(userId) {
  const now = new Date()

  return {
    id: createMockId(),
    userId,
    token: createMockId(),
    expiresAt: new Date(now.getTime() + RESET_TOKEN_DURATION_IN_MS).toISOString(),
    usedAt: null,
    createdAt: createIsoTimestamp(),
  }
}

export function isPasswordResetTokenUsable(token) {
  return Boolean(
    token?.userId &&
      !token.usedAt &&
      new Date(token.expiresAt).getTime() > Date.now(),
  )
}
