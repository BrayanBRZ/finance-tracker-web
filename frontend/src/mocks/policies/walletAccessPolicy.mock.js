import { WALLET_MEMBER_ROLES } from '@/mocks/models/walletModel'
import { findActiveMembership } from '@/mocks/repositories/walletMemberRepository.mock'
import { findWalletById } from '@/mocks/repositories/walletRepository.mock'

export function ensureWalletExists(walletId) {
  const wallet = findWalletById(walletId)

  if (!wallet) {
    throw new Error('Carteira não encontrada')
  }

  return wallet
}

export function ensureWalletAccess({ walletId, userId }) {
  ensureWalletExists(walletId)

  const membership = findActiveMembership({ walletId, userId })

  if (!membership) {
    throw new Error('Você não possui acesso a esta carteira')
  }

  return membership
}

export function ensureWalletOwner({ walletId, userId }) {
  const membership = ensureWalletAccess({ walletId, userId })

  if (membership.role !== WALLET_MEMBER_ROLES.OWNER) {
    throw new Error('Apenas o proprietário pode gerenciar esta carteira')
  }

  return membership
}
