import {
  createOwnerMembership,
  createWallet as createWalletRecord,
  toPublicMembership,
  toPublicWallet,
} from '@/mocks/models/walletModel'
import { ensureAuthenticatedUser } from '@/mocks/policies/authPolicy.mock'
import {
  appendWalletMember,
  findActiveMembership,
  listActiveMembershipsForUser,
} from '@/mocks/repositories/walletMemberRepository.mock'
import {
  appendWallet,
  findWalletById,
  listWallets,
} from '@/mocks/repositories/walletRepository.mock'
import { latency } from '@/mocks/utils/fakeLatency'
import { isSameId } from '@/mocks/utils/id'
import { validateWalletName } from '@/mocks/validators/walletValidator'

const listAccessibleWalletsForUser = (userId) => {
  const wallets = listWallets()

  return listActiveMembershipsForUser(userId)
    .map((membership) => {
      const wallet = wallets.find((candidate) =>
        isSameId(candidate.id, membership.walletId),
      )

      return wallet ? toPublicWallet(wallet, membership) : null
    })
    .filter(Boolean)
}

export async function listWalletsForUser(userId) {
  await latency()

  ensureAuthenticatedUser(userId)

  return listAccessibleWalletsForUser(userId)
}

export async function createWallet({ userId, name, description = '' }) {
  await latency()

  ensureAuthenticatedUser(userId)
  validateWalletName(name)

  const wallet = createWalletRecord({ userId, name, description })
  const membership = createOwnerMembership({
    walletId: wallet.id,
    userId,
  })

  appendWallet(wallet)
  appendWalletMember(membership)

  return {
    wallet: toPublicWallet(wallet, membership),
  }
}

export async function getWalletMembership({ walletId, userId }) {
  await latency()

  ensureAuthenticatedUser(userId)

  if (!findWalletById(walletId)) {
    return null
  }

  const membership = findActiveMembership({ walletId, userId })

  if (!membership) {
    return null
  }

  return toPublicMembership(membership)
}
