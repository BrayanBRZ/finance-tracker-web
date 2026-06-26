import * as authApi from '@/mocks/api/authApi.mock'

export const registerUser = (credentials) => authApi.registerUser(credentials)

export const login = (credentials) => authApi.login(credentials)

export const restoreSession = () => authApi.restoreSession()

export const logout = () => authApi.logout()

export const subscribeToAuthStateChanges = (listener) =>
  authApi.subscribeToAuthStateChanges(listener)
