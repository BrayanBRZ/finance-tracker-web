import { apiRequest } from '@/services/api/client'

export const getCurrentUser = ({ signal } = {}) =>
  apiRequest('/users/me', { signal })

export const changePassword = ({ currentPassword, newPassword }) =>
  apiRequest('/users/me/password', {
    method: 'PATCH',
    body: { currentPassword, newPassword },
  })
