import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSession } from '@/context/sessionContext'
import { RouteLoader } from '@/components/feedback/RouteLoader'

const getSafeRedirect = (search) => {
  const redirect = new URLSearchParams(search).get('redirect')?.trim()

  return redirect?.startsWith('/') && !redirect.startsWith('//')
    ? redirect
    : '/dashboard'
}

export default function GuestGuard() {
  const { isLoading, session } = useSession()
  const location = useLocation()

  if (isLoading) {
    return <RouteLoader />
  }

  if (session) {
    return <Navigate to={getSafeRedirect(location.search)} replace />
  }

  return <Outlet />
}
