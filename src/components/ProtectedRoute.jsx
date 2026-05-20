import { Navigate, useLocation } from 'react-router-dom'

export function ProtectedRoute({ children }) {
  const location = useLocation()
  const token = localStorage.getItem('@project:token')
  const user = localStorage.getItem('@project:user')

  if (!token || !user) {
    // Preserve the attempted URL so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}