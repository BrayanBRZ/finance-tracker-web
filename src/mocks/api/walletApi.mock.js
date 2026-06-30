import { readUsers } from '@/mocks/data/userData'
import { readWallets, writeWallets } from '@/mocks/data/walletData'
import {
  readWalletMembers,
  writeWalletMembers,
} from '@/mocks/data/walletMemberData'
import { latency } from '@/mocks/utils/fakeLatency'
import {
  createOwnerMembership,
  createWallet as createWalletRecord,
  isActiveMembership,
  toPublicMembership,
  toPublicWallet,
} from '@/mocks/models/walletModel'

const isSameId = (leftId, rightId) => String(leftId) === String(rightId)

const findRegisteredUser = (userId) =>
  readUsers().find((user) => isSameId(user.id, userId))

const validateAuthenticatedUser = (userId) => {
  if (!userId || !findRegisteredUser(userId)) {
    throw new Error('Usuário autenticado não encontrado')
  }
}

const validateWalletName = (name) => {
  if (!name?.trim()) {
    throw new Error('O nome da carteira é obrigatório')
  }
}

const findWallet = (walletId) =>
  readWallets().find((wallet) => isSameId(wallet.id, walletId))

const findActiveMembership = ({ walletId, userId }) =>
  readWalletMembers().find(
    (membership) =>
      isSameId(membership.walletId, walletId) &&
      isSameId(membership.userId, userId) &&
      isActiveMembership(membership),
  )

export async function listWalletsForUser(userId) {
  await latency()

  validateAuthenticatedUser(userId)

  const wallets = readWallets()
  const activeMemberships = readWalletMembers().filter(
    (membership) =>
      isSameId(membership.userId, userId) && isActiveMembership(membership),
  )

  return activeMemberships
    .map((membership) => {
      const wallet = wallets.find((candidate) =>
        isSameId(candidate.id, membership.walletId),
      )

      return wallet ? toPublicWallet(wallet, membership) : null
    })
    .filter(Boolean)
}

export async function createWallet({ userId, name, description = '' }) {
  await latency()

  validateAuthenticatedUser(userId)
  validateWalletName(name)

  const wallet = createWalletRecord({ userId, name, description })
  const membership = createOwnerMembership({
    walletId: wallet.id,
    userId,
  })

  writeWallets([...readWallets(), wallet])
  writeWalletMembers([...readWalletMembers(), membership])

  return {
    wallet: toPublicWallet(wallet, membership),
  }
}

export async function getWalletMembership({ walletId, userId }) {
  await latency()

  validateAuthenticatedUser(userId)

  if (!findWallet(walletId)) {
    return null
  }

  const membership = findActiveMembership({ walletId, userId })

  if (!membership) {
    return null
  }

  return toPublicMembership(membership)
}
