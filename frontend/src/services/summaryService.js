import { apiRequest } from '@/services/apiClient'

export const getWalletSummary = ({ walletId, startDate, endDate, signal }) =>
  apiRequest(`/wallets/${walletId}/summary`, {
    query: { startDate, endDate },
    signal,
  })
