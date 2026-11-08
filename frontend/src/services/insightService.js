import { apiRequest } from '@/services/api/client'

export const generateFinancialInsight = ({
  walletId,
  startDate,
  endDate,
  signal,
}) =>
  apiRequest(`/wallets/${walletId}/insights`, {
    method: 'POST',
    body: { startDate, endDate },
    signal,
  })
