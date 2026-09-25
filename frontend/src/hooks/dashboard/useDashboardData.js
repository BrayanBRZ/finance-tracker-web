import { useCallback, useEffect, useState } from 'react'
import { useWallet } from '@/context/walletContext'
import { isAbortError } from '@/services/api/client'
import { getWalletSummary } from '@/services/summaryService'
import { listTransactions } from '@/services/transactionService'

const emptySummary = {
  totalIncome: 0,
  totalExpense: 0,
  balance: 0,
  transactionCount: 0,
  byCategory: [],
  byMonth: [],
  byDay: [],
}

export function useDashboardData({ startDate, endDate }) {
  const { currentWallet } = useWallet()
  const walletId = currentWallet?.id
  const [summary, setSummary] = useState(emptySummary)
  const [recentTransactions, setRecentTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [loadedKey, setLoadedKey] = useState(null)
  const requestKey = `${walletId}:${startDate}:${endDate}`

  const refreshDashboard = useCallback(
    async ({ signal } = {}) => {
      if (!walletId) {
        setSummary(emptySummary)
        setRecentTransactions([])
        setErrorMessage(null)
        setLoadedKey(null)
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setErrorMessage(null)
      setLoadedKey(null)
      try {
        const [nextSummary, recentPage] = await Promise.all([
          getWalletSummary({ walletId, startDate, endDate, signal }),
          listTransactions({
            walletId,
            startDate,
            endDate,
            page: 0,
            size: 5,
            sort: 'date,desc',
            signal,
          }),
        ])
        setSummary(nextSummary)
        setRecentTransactions(recentPage.content)
        setLoadedKey(requestKey)
      } catch (error) {
        if (isAbortError(error)) return
        setSummary(emptySummary)
        setRecentTransactions([])
        setLoadedKey(null)
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Não foi possível carregar o dashboard.',
        )
      } finally {
        if (!signal?.aborted) setIsLoading(false)
      }
    },
    [walletId, startDate, endDate, requestKey],
  )

  useEffect(() => {
    const controller = new AbortController()
    const load = async () => {
      await Promise.resolve()
      await refreshDashboard({ signal: controller.signal })
    }
    void load()
    return () => controller.abort()
  }, [refreshDashboard])

  return {
    ...summary,
    recentTransactions,
    isLoading,
    errorMessage,
    isReady: loadedKey === requestKey && !isLoading && !errorMessage,
    refreshDashboard,
  }
}
