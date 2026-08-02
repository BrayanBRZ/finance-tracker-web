import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSession } from '@/context/sessionContext'
import { PageLoader } from '@/components/feedback/PageLoader'

export default function AuthGuard() {
  const { isLoading, session } = useSession()
  const location = useLocation()

  if (isLoading) {
    return <PageLoader />
  }

  if (!session) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(
          `${location.pathname}${location.search}${location.hash}`
        )}`}
        replace
      />
    )
  }

  return <Outlet />
}
