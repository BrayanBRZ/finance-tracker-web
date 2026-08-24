import { apiRequest } from '@/services/api/client'

export const getWalletSummary = ({ walletId, startDate, endDate, signal }) =>
  apiRequest(`/wallets/${walletId}/summary`, {
    query: { startDate, endDate },
    signal,
  })
