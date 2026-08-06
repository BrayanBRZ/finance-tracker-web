import { SessionContext } from '@/context/sessionContext'
import { useAuthSession } from '@/hooks/auth/useAuthSession'

export const SessionProvider = ({ children }) => {
  const authSession = useAuthSession()

  return (
    <SessionContext.Provider
      value={{
        session: authSession.session,
        isLoading: authSession.isLoading,
        handleLogin: authSession.login,
        handleLogout: authSession.logout,
        refreshSession: authSession.refreshSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}
