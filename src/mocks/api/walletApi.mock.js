import {
  createOwnerMembership,
  createWalletMembership,
  createWallet as createWalletRecord,
  toPublicMembership,
  toPublicWallet,
  updateWallet as updateWalletRecord,
} from '@/mocks/models/walletModel'
import { ensureAuthenticatedUser } from '@/mocks/policies/authPolicy.mock'
import {
  ensureWalletAccess,
  ensureWalletExists,
  ensureWalletOwner,
} from '@/mocks/policies/walletAccessPolicy.mock'
import {
  appendWalletMember,
  findActiveMembership,
  findMembership,
  listActiveMembershipsForUser,
  listMembershipsForWallet,
  replaceWalletMember,
  removeWalletMembersByWalletId,
} from '@/mocks/repositories/walletMemberRepository.mock'
import {
  appendWallet,
  findWalletById,
  listWallets,
  removeWallet as removeWalletRecord,
  replaceWallet,
} from '@/mocks/repositories/walletRepository.mock'
import { removeTransactionsByWalletId } from '@/mocks/repositories/transactionRepository.mock'
import {
  findUserByEmail,
  findUserById,
} from '@/mocks/repositories/userRepository.mock'
import { latency } from '@/mocks/utils/fakeLatency'
import { isSameId } from '@/mocks/utils/id'
import {
  ensureMemberCanBeManaged,
  validateAssignableWalletRole,
  validateWalletName,
} from '@/mocks/validators/walletValidator'
import { WALLET_MEMBER_STATUS } from '@/domain/walletRoles'

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

export async function updateWallet({
  walletId,
  userId,
  name,
  description = '',
}) {
  await latency()

  ensureAuthenticatedUser(userId)
  const membership = ensureWalletOwner({ walletId, userId })
  const wallet = ensureWalletExists(walletId)
  validateWalletName(name)

  const nextWallet = updateWalletRecord({ wallet, name, description })
  replaceWallet(nextWallet)

  return { wallet: toPublicWallet(nextWallet, membership) }
}

export async function removeWallet({ walletId, userId }) {
  await latency()

  ensureAuthenticatedUser(userId)
  ensureWalletOwner({ walletId, userId })
  ensureWalletExists(walletId)

  removeTransactionsByWalletId(walletId)
  removeWalletMembersByWalletId(walletId)
  removeWalletRecord(walletId)

  return null
}

const toPublicWalletMember = (membership) => {
  const user = findUserById(membership.userId)

  return {
    ...toPublicMembership(membership),
    user: user ? { id: user.id, name: user.name, email: user.email } : null,
  }
}

export async function listWalletMembersForUser({ walletId, userId }) {
  await latency()

  ensureAuthenticatedUser(userId)
  ensureWalletAccess({ walletId, userId })

  return listMembershipsForWallet(walletId)
    .filter((membership) => membership.status === WALLET_MEMBER_STATUS.ACTIVE)
    .map(toPublicWalletMember)
}

export async function addWalletMember({ walletId, userId, email, role }) {
  await latency()

  ensureAuthenticatedUser(userId)
  ensureWalletOwner({ walletId, userId })
  validateAssignableWalletRole(role)

  const invitedUser = findUserByEmail(email)

  if (!invitedUser) {
    throw new Error('Nenhum usuário registrado foi encontrado com este e-mail')
  }

  const previousMembership = findMembership({
    walletId,
    userId: invitedUser.id,
  })

  if (previousMembership?.status === WALLET_MEMBER_STATUS.ACTIVE) {
    throw new Error('Este usuário já participa da carteira')
  }

  const membership = previousMembership
    ? {
        ...previousMembership,
        role,
        status: WALLET_MEMBER_STATUS.ACTIVE,
      }
    : createWalletMembership({
        walletId,
        userId: invitedUser.id,
        role,
      })

  if (previousMembership) {
    replaceWalletMember(membership)
  } else {
    appendWalletMember(membership)
  }

  return { member: toPublicWalletMember(membership) }
}

export async function updateWalletMemberRole({
  walletId,
  userId,
  memberUserId,
  role,
}) {
  await latency()

  ensureAuthenticatedUser(userId)
  ensureWalletOwner({ walletId, userId })
  validateAssignableWalletRole(role)

  const membership = findActiveMembership({ walletId, userId: memberUserId })

  if (!membership) {
    throw new Error('Membro da carteira não encontrado')
  }

  ensureMemberCanBeManaged(membership)

  const nextMembership = { ...membership, role }
  replaceWalletMember(nextMembership)

  return { member: toPublicWalletMember(nextMembership) }
}

export async function removeWalletMember({ walletId, userId, memberUserId }) {
  await latency()

  ensureAuthenticatedUser(userId)
  ensureWalletOwner({ walletId, userId })

  const membership = findActiveMembership({ walletId, userId: memberUserId })

  if (!membership) {
    throw new Error('Membro da carteira não encontrado')
  }

  ensureMemberCanBeManaged(membership)

  replaceWalletMember({
    ...membership,
    status: WALLET_MEMBER_STATUS.REMOVED,
  })

  return null
}
