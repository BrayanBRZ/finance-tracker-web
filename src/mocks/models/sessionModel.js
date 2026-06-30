import { createMockId } from '@/mocks/utils/createMockId'
import { createIsoTimestamp, toIsoString } from '@/mocks/utils/date'

const SESSION_DURATION_IN_MS = 1000 * 60 * 60 * 2
const REMEMBER_ME_SESSION_DURATION_IN_MS = 1000 * 60 * 60 * 24 * 30

export function createSessionRecord(userId, { rememberMe = false } = {}) {
  const now = new Date()
  const duration = rememberMe
    ? REMEMBER_ME_SESSION_DURATION_IN_MS
    : SESSION_DURATION_IN_MS
  const expiresAt = new Date(now.getTime() + duration)

  return {
    id: createMockId(),
    userId,
    createdAt: toIsoString(now),
    expiresAt: toIsoString(expiresAt),
    revokedAt: null,
    lastAccessAt: toIsoString(now),
  }
}

export function isSessionRecordActive(sessionRecord) {
  if (!sessionRecord?.id || sessionRecord.userId == null) {
    return false
  }

  if (sessionRecord.revokedAt) {
    return false
  }

  return new Date(sessionRecord.expiresAt).getTime() > Date.now()
}

export function touchSessionRecord(sessionRecord) {
  return {
    ...sessionRecord,
    lastAccessAt: createIsoTimestamp(),
  }
}
