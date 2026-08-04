import * as mockAuth from '@/mocks/api/authApi.mock'
import * as apiAuth from '@/services/authApiService'

const provider =
  (import.meta.env.VITE_AUTH_PROVIDER ?? 'mock').toLowerCase() === 'api'
    ? apiAuth
    : mockAuth

export const registerUser = (credentials) => provider.registerUser(credentials)

export const login = (credentials) => provider.login(credentials)

export async function requestPasswordReset(credentials) {
  const result = await provider.requestPasswordReset(credentials)

  if (result.debugToken) {
    const resetUrl = new URL(
      `/redefinir-senha/${encodeURIComponent(result.debugToken)}`,
      window.location.origin,
    )
    console.log(`Para redefinir sua senha, utilize o link: ${resetUrl}`)
  }

  return result
}

export const resetPassword = (data) => provider.resetPassword(data)

export const changePassword = (data) => provider.changePassword(data)

export const restoreSession = () => provider.restoreSession()

export const logout = () => provider.logout()

export const subscribeToAuthStateChanges = (listener) =>
  provider.subscribeToAuthStateChanges(listener)
