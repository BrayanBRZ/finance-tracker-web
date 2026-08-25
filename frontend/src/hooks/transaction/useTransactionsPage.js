import { useMemo, useState } from 'react'
import { useWallet } from '@/context/walletContext'
import { WALLET_MEMBER_ROLES } from '@/domain/walletRoles'
import { useCategories } from '@/hooks/category/useCategories'
import { useToast } from '@/hooks/useToast'
import { useTransactions } from '@/hooks/transaction/useTransactions'
import { getErrorMessage } from '@/utils/errors'

const defaultFilters = {
  page: 0,
  size: 10,
  sort: 'date,desc',
  type: null,
  categoryId: null,
  startDate: null,
  endDate: null,
}

export function useTransactionsPage() {
  const { currentWallet } = useWallet()
  const { toast } = useToast()
  const [filters, setFilters] = useState(defaultFilters)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [deletingTransaction, setDeletingTransaction] = useState(null)
  const [isDeletePending, setIsDeletePending] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const categoriesState = useCategories()
  const transactionsState = useTransactions(filters)
  const canManageTransactions =
    currentWallet?.currentUserRole === WALLET_MEMBER_ROLES.OWNER ||
    currentWallet?.currentUserRole === WALLET_MEMBER_ROLES.EDITOR

  const setFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value || null, page: 0 }))
  }
  const changePage = (page) =>
    setFilters((current) => ({ ...current, page: page - 1 }))
  const resetFilters = () => setFilters(defaultFilters)

  const filterError = useMemo(() => {
    if (
      filters.startDate &&
      filters.endDate &&
      filters.startDate > filters.endDate
    ) {
      return 'A data inicial deve ser anterior ou igual à data final.'
    }
    return null
  }, [filters.endDate, filters.startDate])

  const saveTransaction = async (transactionData) => {
    try {
      if (editingTransaction) {
        await transactionsState.updateTransaction(
          editingTransaction.id,
          transactionData,
        )
        toast({
          message: 'Transação atualizada com sucesso.',
          variant: 'success',
        })
        setEditingTransaction(null)
      } else {
        await transactionsState.createTransaction(transactionData)
        setFilters((current) => ({ ...current, page: 0 }))
        toast({
          message: 'Transação registrada com sucesso.',
          variant: 'success',
        })
      }
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
      const nextPage = await transactionsState.removeTransaction(
        deletingTransaction.id,
      )
      setFilters((current) => ({ ...current, page: nextPage }))
      toast({ message: 'Transação excluída com sucesso.', variant: 'success' })
    } catch (error) {
      toast({ message: getErrorMessage(error), variant: 'error' })
    } finally {
      setIsDeletePending(false)
      setDeletingTransaction(null)
    }
  }

  const retryPageData = () => {
    if (filterError) return
    void Promise.all([
      transactionsState.refreshTransactions(),
      categoriesState.refreshCategories(),
    ])
  }

  return {
    categories: categoriesState.categories,
    filters,
    filterError,
    isLoading: transactionsState.isLoading || categoriesState.isLoading,
    loadErrorMessage:
      transactionsState.errorMessage ?? categoriesState.errorMessage,
    canManageTransactions,
    pageTransactions: transactionsState.transactions,
    currentPage: transactionsState.pageData.page + 1,
    totalPages: Math.max(1, transactionsState.pageData.totalPages),
    editingTransaction,
    deletingTransaction,
    isDeletePending,
    isFormOpen,
    changePage,
    setFilter,
    resetFilters,
    saveTransaction,
    confirmDeleteTransaction,
    openCreateForm: () => {
      setEditingTransaction(null)
      setIsFormOpen(true)
    },
    openEditForm: (transaction) => {
      setEditingTransaction(transaction)
      setIsFormOpen(true)
    },
    setDeletingTransaction,
    handleFormOpenChange: (isOpen) => {
      setIsFormOpen(isOpen)
      if (!isOpen) setEditingTransaction(null)
    },
    handleDeleteOpenChange: (isOpen) => {
      if (!isOpen && !isDeletePending) setDeletingTransaction(null)
    },
    retryPageData,
  }
}
