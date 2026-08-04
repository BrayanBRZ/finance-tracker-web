import { useState } from 'react'
import { useWallet } from '@/context/walletContext'
import { WALLET_MEMBER_ROLES } from '@/domain/walletRoles'
import { useCategories } from '@/hooks/useCategories'
import { useToast } from '@/hooks/useToast'
import { useTransactions } from '@/hooks/useTransactions'
import { getErrorMessage } from '@/utils/errors'

const TRANSACTIONS_PER_PAGE = 10

export function useTransactionsPage() {
  const { currentWallet } = useWallet()
  const { toast } = useToast()
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [deletingTransaction, setDeletingTransaction] = useState(null)
  const [isDeletePending, setIsDeletePending] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [pagination, setPagination] = useState({ walletId: null, page: 1 })
  const categoriesState = useCategories()
  const transactionsState = useTransactions()
  const canManageTransactions =
    currentWallet?.role === WALLET_MEMBER_ROLES.OWNER ||
    currentWallet?.role === WALLET_MEMBER_ROLES.EDITOR
  const totalPages = Math.max(
    1,
    Math.ceil(transactionsState.transactions.length / TRANSACTIONS_PER_PAGE),
  )
  const currentPage =
    pagination.walletId === currentWallet?.id
      ? Math.min(pagination.page, totalPages)
      : 1
  const pageTransactions = transactionsState.transactions.slice(
    (currentPage - 1) * TRANSACTIONS_PER_PAGE,
    currentPage * TRANSACTIONS_PER_PAGE,
  )
  const loadErrorMessage =
    transactionsState.errorMessage ?? categoriesState.errorMessage

  const changePage = (page) => {
    setPagination({ walletId: currentWallet?.id ?? null, page })
  }

  const saveTransaction = async (transactionData) => {
    try {
      if (editingTransaction) {
        await transactionsState.updateTransaction(
          editingTransaction.id,
          transactionData,
        )
        toast({ message: 'Transação atualizada com sucesso.', variant: 'success' })
        setEditingTransaction(null)
        setIsFormOpen(false)
        return
      }

      await transactionsState.createTransaction(transactionData)
      toast({ message: 'Transação registrada com sucesso.', variant: 'success' })
      changePage(1)
      setIsFormOpen(false)
    } catch (error) {
      toast({ message: getErrorMessage(error), variant: 'error' })
      throw error
    }
  }

  const confirmDeleteTransaction = async () => {
    if (!deletingTransaction) return

    setIsDeletePending(true)
    try {
      await transactionsState.removeTransaction(deletingTransaction.id)
      toast({ message: 'Transação excluída com sucesso.', variant: 'success' })
    } catch (error) {
      toast({ message: getErrorMessage(error), variant: 'error' })
    } finally {
      setIsDeletePending(false)
      setDeletingTransaction(null)
    }
  }

  const openCreateForm = () => {
    setEditingTransaction(null)
    setIsFormOpen(true)
  }
  const openEditForm = (transaction) => {
    setEditingTransaction(transaction)
    setIsFormOpen(true)
  }
  const handleFormOpenChange = (isOpen) => {
    setIsFormOpen(isOpen)
    if (!isOpen) setEditingTransaction(null)
  }
  const handleDeleteOpenChange = (isOpen) => {
    if (!isOpen && !isDeletePending) setDeletingTransaction(null)
  }
  const retryPageData = () =>
    void Promise.all([
      transactionsState.refreshTransactions(),
      categoriesState.refreshCategories(),
    ])

  return {
    categories: categoriesState.categories,
    isLoading: transactionsState.isLoading || categoriesState.isLoading,
    loadErrorMessage,
    canManageTransactions,
    pageTransactions,
    currentPage,
    totalPages,
    editingTransaction,
    deletingTransaction,
    isDeletePending,
    isFormOpen,
    changePage,
    saveTransaction,
    confirmDeleteTransaction,
    openCreateForm,
    openEditForm,
    setDeletingTransaction,
    handleFormOpenChange,
    handleDeleteOpenChange,
    retryPageData,
  }
}
