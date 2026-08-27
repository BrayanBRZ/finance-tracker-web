import { apiRequest } from '@/services/api/client'

export const createWallet = (data) =>
  apiRequest('/wallets', { method: 'POST', body: data })

export const listWallets = ({ signal } = {}) =>
  apiRequest('/wallets', { signal })

export const updateWallet = (walletId, data) =>
  apiRequest(`/wallets/${walletId}`, { method: 'PUT', body: data })

export const removeWallet = (walletId) =>
  apiRequest(`/wallets/${walletId}`, { method: 'DELETE' })

export const addWalletMember = (walletId, data) =>
  apiRequest(`/wallets/${walletId}/members`, { method: 'POST', body: data })

export const listWalletMembers = (walletId, { signal } = {}) =>
  apiRequest(`/wallets/${walletId}/members`, { signal })

export const updateWalletMemberRole = (walletId, memberUserId, role) =>
  apiRequest(`/wallets/${walletId}/members/${memberUserId}`, {
    method: 'PATCH',
    body: { role },
  })

export const removeWalletMember = (walletId, memberUserId) =>
  apiRequest(`/wallets/${walletId}/members/${memberUserId}`, {
    method: 'DELETE',
  })
