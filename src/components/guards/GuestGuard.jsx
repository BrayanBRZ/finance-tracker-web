import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSession } from '@/context/sessionContext'
import { PageLoader } from '@/components/feedback/PageLoader'

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
    return <PageLoader />
  }

  if (session) {
    return <Navigate to={getSafeRedirect(location.search)} replace />
  }

  return <Outlet />
}
