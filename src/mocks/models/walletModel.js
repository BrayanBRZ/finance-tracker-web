import { createMockId } from '@/mocks/utils/createMockId'
import { createIsoTimestamp } from '@/mocks/utils/date'
import {
  normalizeOptionalText,
  normalizeRequiredText,
} from '@/mocks/utils/text'

export const WALLET_MEMBER_ROLES = Object.freeze({
  OWNER: 'OWNER',
  COLLABORATOR: 'COLLABORATOR',
  VIEWER: 'VIEWER',
})

export const WALLET_MEMBER_STATUS = Object.freeze({
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  REMOVED: 'REMOVED',
})

export function createWallet({ userId, name, description = '' }) {
  const now = createIsoTimestamp()

  return {
    id: createMockId(),
    createdById: userId,
    name: normalizeRequiredText(name),
    description: normalizeOptionalText(description),
    createdAt: now,
    updatedAt: now,
  }
}

export function createOwnerMembership({ walletId, userId }) {
  return {
    walletId,
    userId,
    role: WALLET_MEMBER_ROLES.OWNER,
    status: WALLET_MEMBER_STATUS.ACTIVE,
    addedAt: createIsoTimestamp(),
  }
}

export function isActiveMembership(membership) {
  return membership?.status === WALLET_MEMBER_STATUS.ACTIVE
}

export function toPublicWallet(wallet, membership) {
  return {
    id: wallet.id,
    createdById: wallet.createdById,
    name: wallet.name,
    description: wallet.description,
    role: membership.role,
    status: membership.status,
    createdAt: wallet.createdAt,
    updatedAt: wallet.updatedAt,
  }
}

export function toPublicMembership(membership) {
  return {
    walletId: membership.walletId,
    userId: membership.userId,
    role: membership.role,
    status: membership.status,
    addedAt: membership.addedAt,
  }
}
