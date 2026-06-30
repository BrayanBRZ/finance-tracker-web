import { hasText } from '@/mocks/utils/text'

export function validateWalletName(name) {
  if (!hasText(name)) {
    throw new Error('O nome da carteira é obrigatório')
  }
}
