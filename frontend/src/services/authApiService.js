import { apiRequest } from '@/services/apiClient'
import {
  API_SESSION_STORAGE_KEY,
  clearApiSession,
  readApiSession,
  writeApiSession,
} from '@/storage/authTokenStorage'

const toSession = (token, user) => ({
  ...token,
  user,
  expiresAt: new Date(Date.now() + token.expiresIn * 1000).toISOString(),
})

export const registerUser = ({ name, email, password }) =>
  apiRequest('/auth/register', {
    method: 'POST',
    body: { name, email, password },
  })

export async function login({ email, password, rememberMe = false }) {
  const token = await apiRequest('/auth/login', {
    method: 'POST',
    body: { email, password },
  })
  writeApiSession(token, rememberMe)

  try {
    const user = await apiRequest('/users/me')
    const session = toSession(token, user)
    writeApiSession(session, rememberMe)
    return session
  } catch (error) {
    clearApiSession()
    throw error
  }
}

export const requestPasswordReset = ({ email }) =>
  apiRequest('/auth/forgot-password', {
    method: 'POST',
    body: { email },
  })

export const resetPassword = ({ token, newPassword }) =>
  apiRequest('/auth/reset-password', {
    method: 'POST',
    body: { token, newPassword },
  })

export const changePassword = ({ currentPassword, newPassword }) =>
  apiRequest('/users/me/password', {
    method: 'PATCH',
    body: { currentPassword, newPassword },
  })

export async function restoreSession() {
  const stored = readApiSession()
  if (!stored?.accessToken) return null

  try {
    const user = await apiRequest('/users/me')
    return { ...stored, user }
  } catch {
    clearApiSession()
    return null
  }
}

export async function logout() {
  clearApiSession()
}

export function subscribeToAuthStateChanges(listener) {
  const handleStorage = (event) => {
    if (event.key === API_SESSION_STORAGE_KEY) listener()
  }
  window.addEventListener('storage', handleStorage)
  return () => window.removeEventListener('storage', handleStorage)
}
