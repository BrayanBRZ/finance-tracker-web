import { Navigate, useLocation } from 'react-router-dom'
import { getAuthUser, getAuthToken } from '@/utils/auth';

export function ProtectedRoute({ children }) {
  const location = useLocation()
  const token = getAuthToken()
  const user = getAuthUser()

  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}