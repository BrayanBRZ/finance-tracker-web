import { findUserById } from '@/mocks/repositories/userRepository.mock'

export function ensureAuthenticatedUser(userId) {
  const user = userId ? findUserById(userId) : null

  if (!user) {
    throw new Error('Usuário autenticado não encontrado')
  }

  return user
}
