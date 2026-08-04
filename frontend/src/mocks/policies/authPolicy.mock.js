export function ensureAuthenticatedUser(userId) {
  if (userId == null || userId === '') {
    throw new Error('Usuário autenticado não encontrado')
  }

  return { id: userId }
}
