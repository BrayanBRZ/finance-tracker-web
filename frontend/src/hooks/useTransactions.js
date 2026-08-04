import { useCallback, useEffect, useState } from 'react'
import { useSession } from '@/context/sessionContext'
import { useWallet } from '@/context/walletContext'
import { useAsyncScopeGuard } from '@/hooks/useAsyncScopeGuard'
import {
  createTransaction as createTransactionOperation,
  listTransactionsForWallet,
  removeTransaction as removeTransactionOperation,
  updateTransaction as updateTransactionOperation,
} from '@/services/transactionService'
import { sortTransactionsByRecency } from '@/utils/transactions'

const getErrorMessage = (error) =>
  error instanceof Error
    ? error.message
    : 'Não foi possível carregar as transações.'

export function useTransactions() {
  const { session } = useSession()
  const { currentWallet } = useWallet()
  const userId = session?.user.id
  const walletId = currentWallet?.id
  const [transactions, setTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const {
    beginRequest,
    captureScope,
    invalidateRequests,
    isRequestCurrent,
    isScopeCurrent,
  } = useAsyncScopeGuard(JSON.stringify([userId ?? null, walletId ?? null]))

  const refreshTransactions = useCallback(async () => {
    const request = beginRequest()

    if (!userId || !walletId) {
      if (isRequestCurrent(request)) {
        setTransactions([])
        setIsLoading(false)
        setErrorMessage(null)
      }

      return []
    }

    setIsLoading(true)
    setErrorMessage(null)

    try {
      const nextTransactions = sortTransactionsByRecency(
        await listTransactionsForWallet({ userId, walletId }),
      )

      if (!isRequestCurrent(request)) return []

      setTransactions(nextTransactions)
      return nextTransactions
    } catch (error) {
      if (!isRequestCurrent(request)) return []

      setTransactions([])
      setErrorMessage(getErrorMessage(error))
      return []
    } finally {
      if (isRequestCurrent(request)) {
        setIsLoading(false)
      }
    }
  }, [beginRequest, isRequestCurrent, userId, walletId])

  useEffect(() => {
    const loadTransactions = async () => {
      await Promise.resolve()
      await refreshTransactions()
    }

    void loadTransactions()
  }, [refreshTransactions])

  const createTransaction = async (transactionData) => {
    if (!userId || !walletId) {
      throw new Error('Selecione uma carteira antes de criar transações.')
    }

    const mutationScope = captureScope()
    const { transaction } = await createTransactionOperation({
      userId,
      walletId,
      ...transactionData,
    })

    if (isScopeCurrent(mutationScope)) {
      invalidateRequests()
      setIsLoading(false)
      setTransactions((currentTransactions) =>
        sortTransactionsByRecency([transaction, ...currentTransactions]),
      )
    }

    return transaction
  }

  const updateTransaction = async (transactionId, transactionData) => {
    if (!userId || !walletId) {
      throw new Error('Selecione uma carteira antes de editar transações.')
    }

    const mutationScope = captureScope()
    const { transaction } = await updateTransactionOperation({
      userId,
      walletId,
      transactionId,
      ...transactionData,
    })

    if (isScopeCurrent(mutationScope)) {
      invalidateRequests()
      setIsLoading(false)
      setTransactions((currentTransactions) =>
        sortTransactionsByRecency(
          currentTransactions.map((currentTransaction) =>
            currentTransaction.id === transaction.id
              ? transaction
              : currentTransaction,
          ),
        ),
      )
    }

    return transaction
  }

  const removeTransaction = async (transactionId) => {
    if (!userId || !walletId) {
      throw new Error('Selecione uma carteira antes de excluir transações.')
    }

    const mutationScope = captureScope()
    await removeTransactionOperation({ userId, walletId, transactionId })

    if (isScopeCurrent(mutationScope)) {
      invalidateRequests()
      setIsLoading(false)
      setTransactions((currentTransactions) =>
        currentTransactions.filter(
          (transaction) => transaction.id !== transactionId,
        ),
      )
    }
  }

  return {
    transactions,
    isLoading,
    errorMessage,
    refreshTransactions,
    createTransaction,
    updateTransaction,
    removeTransaction,
  }
}
