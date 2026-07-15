import { hasText } from '@/mocks/utils/text'
import {
  ASSIGNABLE_WALLET_MEMBER_ROLES,
  WALLET_MEMBER_ROLES,
} from '@/domain/walletRoles'

export function validateWalletName(name) {
  if (!hasText(name)) {
    throw new Error('O nome da carteira é obrigatório')
  }
}

export function validateAssignableWalletRole(role) {
  if (!ASSIGNABLE_WALLET_MEMBER_ROLES.includes(role)) {
    throw new Error('Selecione um papel válido para o membro')
  }
}

export function ensureMemberCanBeManaged(membership) {
  if (membership.role === WALLET_MEMBER_ROLES.OWNER) {
    throw new Error('O proprietário só pode ser alterado por transferência de propriedade')
  }
}
