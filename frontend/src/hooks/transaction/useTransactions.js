import { useCallback, useEffect, useState } from 'react'
import { useWallet } from '@/context/walletContext'
import { isAbortError } from '@/services/api/client'
import {
  createTransaction as createTransactionRequest,
  listTransactions,
  removeTransaction as removeTransactionRequest,
  updateTransaction as updateTransactionRequest,
} from '@/services/transactionService'

const emptyPage = {
  content: [],
  page: 0,
  size: 10,
  totalElements: 0,
  totalPages: 0,
}

const getErrorMessage = (error) =>
  error instanceof Error
    ? error.message
    : 'Não foi possível carregar as transações.'

export function useTransactions(filters) {
  const { currentWallet } = useWallet()
  const walletId = currentWallet?.id
  const hasInvalidDateRange =
    filters.startDate && filters.endDate && filters.startDate > filters.endDate
  const [pageData, setPageData] = useState(emptyPage)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const refreshTransactions = useCallback(
    async ({ signal, page: requestedPage } = {}) => {
      if (!walletId) {
        setPageData(emptyPage)
        setErrorMessage(null)
        setIsLoading(false)
        return emptyPage
      }

      if (hasInvalidDateRange) return emptyPage

      setIsLoading(true)
      setErrorMessage(null)
      try {
        const nextPage = await listTransactions({
          walletId,
          ...filters,
          page: requestedPage ?? filters.page,
          signal,
        })
        setPageData(nextPage)
        return nextPage
      } catch (error) {
        if (isAbortError(error)) return emptyPage
        setPageData(emptyPage)
        setErrorMessage(getErrorMessage(error))
        return emptyPage
      } finally {
        if (!signal?.aborted) setIsLoading(false)
      }
    },
    [filters, hasInvalidDateRange, walletId],
  )

  useEffect(() => {
    const controller = new AbortController()
    const load = async () => {
      await Promise.resolve()
      await refreshTransactions({ signal: controller.signal })
    }
    void load()
    return () => controller.abort()
  }, [refreshTransactions])

  const createTransaction = async (data) => {
    if (!walletId)
      throw new Error('Selecione uma carteira antes de criar transações.')
    const transaction = await createTransactionRequest(walletId, data)
    await refreshTransactions({ page: 0 })
    return transaction
  }

  const updateTransaction = async (transactionId, data) => {
    if (!walletId)
      throw new Error('Selecione uma carteira antes de editar transações.')
    const transaction = await updateTransactionRequest(
      walletId,
      transactionId,
      data,
    )
    await refreshTransactions()
    return transaction
  }

  const removeTransaction = async (transactionId) => {
    if (!walletId)
      throw new Error('Selecione uma carteira antes de excluir transações.')
    await removeTransactionRequest(walletId, transactionId)
    const nextPage =
      pageData.content.length === 1 && filters.page > 0
        ? filters.page - 1
        : filters.page
    await refreshTransactions({ page: nextPage })
    return nextPage
  }

  return {
    transactions: pageData.content,
    pageData,
    isLoading,
    errorMessage,
    refreshTransactions,
    createTransaction,
    updateTransaction,
    removeTransaction,
  }
}
