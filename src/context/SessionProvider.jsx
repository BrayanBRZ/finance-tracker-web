import { useCallback, useEffect, useState } from 'react'
import { SessionContext } from '@/context/sessionContext'
import { logout, restoreSession, subscribeToAuthStateChanges } from '@/services/authService'

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const handleLogin = useCallback((authSession) => {
    setSession(authSession)
  }, [])

  const handleLogout = useCallback(async () => {
    try {
      await logout()
    } finally {
      setSession(null)
    }
  }, [])

  const refreshSession = useCallback(async () => {
    try {
      const restoredSession = await restoreSession()
      setSession(restoredSession)
      return restoredSession
    } catch {
      setSession(null)
      return null
    }
  }, [])

  useEffect(() => {
    let isActive = true

    const checkSession = async () => {
      try {
        const restoredSession = await restoreSession()

        if (isActive) {
          setSession(restoredSession)
        }
      } catch {
        if (isActive) {
          setSession(null)
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    const revalidateSession = () => {
      void checkSession()
    }

    void checkSession()

    const unsubscribe = subscribeToAuthStateChanges(revalidateSession)

    return () => {
      isActive = false
      unsubscribe()
    }
  }, [])

  return (
    <SessionContext.Provider
      value={{
        session,
        isLoading,
        handleLogin,
        handleLogout,
        refreshSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}
