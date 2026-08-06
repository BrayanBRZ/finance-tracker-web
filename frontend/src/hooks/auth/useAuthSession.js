import { useCallback, useEffect, useState } from 'react'
import {
  API_SESSION_STORAGE_KEY,
  AUTH_SESSION_CHANGED_EVENT,
  clearApiSession,
  readApiSession,
  writeApiSession,
} from '@/storage/authTokenStorage'
import { login as loginRequest } from '@/services/authService'
import { getCurrentUser } from '@/services/userService'

const toSession = (token, user) => ({
  ...token,
  user,
  expiresAt: new Date(Date.now() + token.expiresIn * 1000).toISOString(),
})

const isExpired = (session) =>
  !session?.expiresAt || new Date(session.expiresAt).getTime() <= Date.now()

export function useAuthSession() {
  const [session, setSession] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const restoreSession = useCallback(async () => {
    const storedSession = readApiSession()
    if (!storedSession?.accessToken || isExpired(storedSession)) {
      clearApiSession(false)
      setSession(null)
      return null
    }

    try {
      const user = await getCurrentUser()
      const restoredSession = { ...storedSession, user }
      setSession(restoredSession)
      return restoredSession
    } catch {
      clearApiSession(false)
      setSession(null)
      return null
    }
  }, [])

  const login = useCallback(async (credentials) => {
    const token = await loginRequest(credentials)
    writeApiSession(token, credentials.rememberMe)

    try {
      const user = await getCurrentUser()
      const authSession = toSession(token, user)
      writeApiSession(authSession, credentials.rememberMe)
      setSession(authSession)
      return authSession
    } catch (error) {
      clearApiSession()
      throw error
    }
  }, [])

  const logout = useCallback(() => {
    clearApiSession()
    setSession(null)
  }, [])

  useEffect(() => {
    let active = true
    const synchronize = async () => {
      await restoreSession()
      if (active) setIsLoading(false)
    }
    const handleStorage = (event) => {
      if (
        event.type === AUTH_SESSION_CHANGED_EVENT ||
        event.key === API_SESSION_STORAGE_KEY
      ) {
        void restoreSession()
      }
    }

    void synchronize()
    window.addEventListener('storage', handleStorage)
    window.addEventListener(AUTH_SESSION_CHANGED_EVENT, handleStorage)

    return () => {
      active = false
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener(AUTH_SESSION_CHANGED_EVENT, handleStorage)
    }
  }, [restoreSession])

  return { session, isLoading, login, logout, refreshSession: restoreSession }
}
