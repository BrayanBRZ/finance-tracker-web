import { apiRequest } from '@/services/apiClient'

export const registerUser = ({ name, email, password }) =>
  apiRequest('/auth/register', {
    method: 'POST',
    auth: false,
    body: { name, email, password },
  })

export const login = ({ email, password }) =>
  apiRequest('/auth/login', {
    method: 'POST',
    auth: false,
    body: { email, password },
  })

export async function requestPasswordReset({ email }) {
  const result = await apiRequest('/auth/forgot-password', {
    method: 'POST',
    auth: false,
    body: { email },
  })

  if (result.debugToken) {
    const resetUrl = new URL(
      `/redefinir-senha/${encodeURIComponent(result.debugToken)}`,
      window.location.origin,
    )
    console.info(`Para redefinir sua senha, utilize o link: ${resetUrl}`)
  }

  return result
}

export const resetPassword = ({ token, newPassword }) =>
  apiRequest('/auth/reset-password', {
    method: 'POST',
    auth: false,
    body: { token, newPassword },
  })
