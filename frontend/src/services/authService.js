import * as authApi from '@/mocks/api/authApi.mock'

export const registerUser = (credentials) => authApi.registerUser(credentials)

export const login = (credentials) => authApi.login(credentials)

export async function requestPasswordReset(data) {
  const result = await authApi.requestPasswordReset(data)

  if (result.debugToken) {
    const resetUrl = new URL(
      `/redefinir-senha/${encodeURIComponent(result.debugToken)}`,
      window.location.origin,
    )
    console.log(`Para redefinir sua senha, utilize o link: ${resetUrl}`)
  }

  return result
}

export const resetPassword = (data) => authApi.resetPassword(data)

export const changePassword = (data) => authApi.changePassword(data)

export const restoreSession = () => authApi.restoreSession()

export const logout = () => authApi.logout()

export const subscribeToAuthStateChanges = (listener) =>
  authApi.subscribeToAuthStateChanges(listener)
