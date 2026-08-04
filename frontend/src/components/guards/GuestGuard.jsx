import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSession } from '@/context/sessionContext'
import { PageLoader } from '@/components/feedback/PageLoader'

const LEGACY_REDIRECTS = {
  '/dashboard': '/app/dashboard',
  '/transacoes': '/app/transacoes',
  '/categorias': '/app/categorias',
  '/carteira': '/app/carteira',
}

const normalizeRedirect = (redirect) => {
  const legacyPath = Object.keys(LEGACY_REDIRECTS).find(
    (path) =>
      redirect === path ||
      redirect.startsWith(`${path}?`) ||
      redirect.startsWith(`${path}#`),
  )

  return legacyPath
    ? `${LEGACY_REDIRECTS[legacyPath]}${redirect.slice(legacyPath.length)}`
    : redirect
}

const getSafeRedirect = (search) => {
  const redirect = new URLSearchParams(search).get('redirect')?.trim()

  if (!redirect?.startsWith('/') || redirect.startsWith('//')) {
    return '/app/dashboard'
  }

  return normalizeRedirect(redirect)
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
