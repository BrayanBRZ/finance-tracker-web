import { apiRequest } from '@/services/api/client'

export const downloadSummaryReport = ({ walletId, startDate, endDate }) =>
  apiRequest(`/wallets/${walletId}/reports/summary.pdf`, {
    query: { startDate, endDate },
    responseType: 'blob',
  })
