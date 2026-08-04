import { latency } from '@/mocks/utils/fakeLatency'
import {
  createSessionRecord,
  isSessionRecordActive,
  touchSessionRecord,
} from '@/mocks/models/sessionModel'
import {
  createPasswordResetToken,
  isPasswordResetTokenUsable,
} from '@/mocks/models/passwordResetTokenModel'
import { createUser, toPublicUser } from '@/mocks/models/userModel'
import {
  appendPasswordResetToken,
  findPasswordResetToken,
  replacePasswordResetToken,
} from '@/mocks/repositories/passwordResetTokenRepository.mock'
import {
  clearSessionRecord,
  readSessionRecord,
  SESSION_STORAGE_KEY,
  writeSessionRecord,
} from '@/mocks/repositories/sessionRepository.mock'
import {
  appendUser,
  findUserByEmail,
  findUserById,
  replaceUser,
} from '@/mocks/repositories/userRepository.mock'
import { createIsoTimestamp } from '@/mocks/utils/date'

const neutralRecoveryMessage =
  'Se este e-mail estiver cadastrado, você receberá as instruções em breve.'

export async function registerUser({ name, email, password }) {
  await latency()

  if (findUserByEmail(email)) {
    throw new Error('Este e-mail já está cadastrado')
  }

  const user = createUser({ name, email, password })
  appendUser(user)

  return { user: toPublicUser(user) }
}

export async function login({ email, password, rememberMe = false }) {
  await latency()

  const user = findUserByEmail(email)

  if (!user || user.password !== password) {
    throw new Error('E-mail ou senha incorretos')
  }

  const sessionRecord = createSessionRecord(user.id, { rememberMe })
  writeSessionRecord(sessionRecord)

  return { user: toPublicUser(user) }
}

export async function requestPasswordReset({ email }) {
  await latency()

  const user = findUserByEmail(email)
  if (!user) {
    return {
      message: neutralRecoveryMessage,
      debugToken: null,
    }
  }

  const token = createPasswordResetToken(user.id)
  appendPasswordResetToken(token)

  return {
    message: neutralRecoveryMessage,
    debugToken: token.token,
  }
}

export async function resetPassword({ token, newPassword }) {
  await latency()

  const resetToken = findPasswordResetToken(token)

  if (!isPasswordResetTokenUsable(resetToken)) {
    throw new Error(
      'O link de redefinição é inválido, expirou ou já foi utilizado.',
    )
  }

  const user = findUserById(resetToken.userId)

  if (!user) {
    throw new Error(
      'O link de redefinição é inválido, expirou ou já foi utilizado.',
    )
  }

  replaceUser({ ...user, password: newPassword })
  replacePasswordResetToken({ ...resetToken, usedAt: createIsoTimestamp() })

  return { message: 'Senha redefinida com sucesso.' }
}

export async function changePassword({ userId, currentPassword, newPassword }) {
  await latency()

  const user = findUserById(userId)

  if (!user) throw new Error('Usuário não encontrado')

  if (user.password !== currentPassword) {
    throw new Error('A senha atual está incorreta')
  }

  replaceUser({ ...user, password: newPassword })

  return { message: 'Senha alterada com sucesso.' }
}

export async function restoreSession() {
  const sessionRecord = readSessionRecord()

  if (!isSessionRecordActive(sessionRecord)) {
    clearSessionRecord()
    return null
  }

  const user = findUserById(sessionRecord.userId)

  if (!user) {
    clearSessionRecord()
    return null
  }

  writeSessionRecord(touchSessionRecord(sessionRecord))

  return { user: toPublicUser(user) }
}

export async function logout() {
  await latency()
  clearSessionRecord()
}

export function subscribeToAuthStateChanges(listener) {
  const handleStorage = (event) => {
    if (event.key === SESSION_STORAGE_KEY) listener()
  }

  window.addEventListener('storage', handleStorage)

  return () => window.removeEventListener('storage', handleStorage)
}
