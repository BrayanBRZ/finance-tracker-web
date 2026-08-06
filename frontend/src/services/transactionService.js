import { apiRequest } from '@/services/apiClient'

export const listTransactions = ({ walletId, signal, ...query }) =>
  apiRequest(`/wallets/${walletId}/transactions`, { query, signal })

export const createTransaction = (walletId, data) =>
  apiRequest(`/wallets/${walletId}/transactions`, {
    method: 'POST',
    body: data,
  })

export const updateTransaction = (walletId, transactionId, data) =>
  apiRequest(`/wallets/${walletId}/transactions/${transactionId}`, {
    method: 'PUT',
    body: data,
  })

export const removeTransaction = (walletId, transactionId) =>
  apiRequest(`/wallets/${walletId}/transactions/${transactionId}`, {
    method: 'DELETE',
  })
