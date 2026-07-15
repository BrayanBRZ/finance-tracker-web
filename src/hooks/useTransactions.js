import { useCallback, useEffect, useState } from 'react'
import { useSession } from '@/context/sessionContext'
import { useWallet } from '@/context/walletContext'
import {
  createTransaction as createTransactionOperation,
  listTransactionsForWallet,
  removeTransaction as removeTransactionOperation,
  updateTransaction as updateTransactionOperation,
} from '@/services/transactionService'

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

  const refreshTransactions = useCallback(async () => {
    if (!userId || !walletId) {
      setTransactions([])
      setErrorMessage(null)
      return []
    }

    setIsLoading(true)
    setErrorMessage(null)

    try {
      const nextTransactions = await listTransactionsForWallet({ userId, walletId })
      setTransactions(nextTransactions)
      return nextTransactions
    } catch (error) {
      setTransactions([])
      setErrorMessage(getErrorMessage(error))
      return []
    } finally {
      setIsLoading(false)
    }
  }, [userId, walletId])

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

    const { transaction } = await createTransactionOperation({
      userId,
      walletId,
      ...transactionData,
    })
    setTransactions((currentTransactions) => [transaction, ...currentTransactions])
    return transaction
  }

  const updateTransaction = async (transactionId, transactionData) => {
    if (!userId || !walletId) {
      throw new Error('Selecione uma carteira antes de editar transações.')
    }

    const { transaction } = await updateTransactionOperation({
      userId,
      walletId,
      transactionId,
      ...transactionData,
    })
    setTransactions((currentTransactions) =>
      currentTransactions.map((currentTransaction) =>
        currentTransaction.id === transaction.id ? transaction : currentTransaction,
      ),
    )
    return transaction
  }

  const removeTransaction = async (transactionId) => {
    if (!userId || !walletId) {
      throw new Error('Selecione uma carteira antes de excluir transações.')
    }

    await removeTransactionOperation({ userId, walletId, transactionId })
    setTransactions((currentTransactions) =>
      currentTransactions.filter((transaction) => transaction.id !== transactionId),
    )
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
