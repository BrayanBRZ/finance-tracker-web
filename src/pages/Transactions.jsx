import { useState } from 'react'
import { Plus } from 'lucide-react'
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog'
import { PageErrorState } from '@/components/feedback/PageErrorState'
import { PageLoader } from '@/components/feedback/PageLoader'
import { FormDialog } from '@/components/forms/FormDialog'
import { PageHeader } from '@/components/layout/PageHeader'
import { TransactionForm } from '@/components/transactions/TransactionForm'
import { TransactionList } from '@/components/transactions/TransactionList'
import { Button } from '@/components/ui/button'
import { WalletScope } from '@/components/wallets/WalletScope'
import { useWallet } from '@/context/walletContext'
import { WALLET_MEMBER_ROLES } from '@/domain/walletRoles'
import { useCategories } from '@/hooks/useCategories'
import { useTransactions } from '@/hooks/useTransactions'
import { useToast } from '@/hooks/useToast'

const TRANSACTIONS_PER_PAGE = 10

const getErrorMessage = (error) =>
  error instanceof Error
    ? error.message
    : 'Não foi possível concluir a operação.'

function TransactionsContent() {
  const { currentWallet } = useWallet()
  const { toast } = useToast()
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [deletingTransaction, setDeletingTransaction] = useState(null)
  const [isDeletePending, setIsDeletePending] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [pagination, setPagination] = useState({
    walletId: null,
    page: 1,
  })
  const {
    categories,
    isLoading: isLoadingCategories,
    errorMessage: categoriesErrorMessage,
    refreshCategories,
  } = useCategories()
  const {
    transactions,
    isLoading,
    errorMessage,
    refreshTransactions,
    createTransaction,
    updateTransaction,
    removeTransaction,
  } = useTransactions()
  const canManageTransactions =
    currentWallet?.role === WALLET_MEMBER_ROLES.OWNER ||
    currentWallet?.role === WALLET_MEMBER_ROLES.EDITOR
  const loadErrorMessage = errorMessage ?? categoriesErrorMessage
  const totalPages = Math.max(
    1,
    Math.ceil(transactions.length / TRANSACTIONS_PER_PAGE),
  )
  const currentPage =
    pagination.walletId === currentWallet?.id
      ? Math.min(pagination.page, totalPages)
      : 1
  const pageTransactions = transactions.slice(
    (currentPage - 1) * TRANSACTIONS_PER_PAGE,
    currentPage * TRANSACTIONS_PER_PAGE,
  )

  const changePage = (page) => {
    setPagination({
      walletId: currentWallet?.id ?? null,
      page,
    })
  }

  const saveTransaction = async (transactionData) => {
    try {
      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, transactionData)
        toast({
          message: 'Transação atualizada com sucesso.',
          variant: 'success',
        })
        setEditingTransaction(null)
        setIsFormOpen(false)
        return
      }

      await createTransaction(transactionData)
      toast({
        message: 'Transação registrada com sucesso.',
        variant: 'success',
      })
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
      await removeTransaction(deletingTransaction.id)
      toast({ message: 'Transação excluída com sucesso.', variant: 'success' })
      setDeletingTransaction(null)
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

  const retryPageData = () =>
    void Promise.all([refreshTransactions(), refreshCategories()])

  return isLoading || isLoadingCategories ? (
    <PageLoader />
  ) : loadErrorMessage ? (
    <PageErrorState
      eyebrow="Não foi possível carregar transações"
      description={loadErrorMessage}
      onRetry={retryPageData}
    />
  ) : (
    <div className="flex h-full min-h-0 flex-col gap-6">
      <PageHeader
        title="Transações"
        description="Gerencie receitas e despesas da carteira selecionada."
        actions={
          canManageTransactions ? (
            <Button type="button" onClick={openCreateForm}>
              <Plus aria-hidden="true" />
              Nova transação
            </Button>
          ) : null
        }
      />
      <TransactionList
        transactions={pageTransactions}
        page={currentPage}
        totalPages={totalPages}
        canEditTransaction={() => canManageTransactions}
        canDelete={canManageTransactions}
        onPageChange={changePage}
        onEdit={openEditForm}
        onDelete={setDeletingTransaction}
      />

      <FormDialog
        open={isFormOpen}
        onOpenChange={handleFormOpenChange}
        title={editingTransaction ? 'Editar transação' : 'Nova transação'}
        description="Escolha o tipo da transação. A categoria pessoal é opcional."
      >
        <TransactionForm
          categories={categories}
          transaction={editingTransaction}
          onSubmit={saveTransaction}
          onCancel={() => handleFormOpenChange(false)}
        />
      </FormDialog>

      <ConfirmDialog
        open={Boolean(deletingTransaction)}
        onOpenChange={(isOpen) => {
          if (!isOpen && !isDeletePending) setDeletingTransaction(null)
        }}
        title="Excluir transação"
        description={`A transação “${deletingTransaction?.description ?? ''}” será removida permanentemente.`}
        confirmLabel="Excluir transação"
        isPending={isDeletePending}
        onConfirm={confirmDeleteTransaction}
      />
    </div>
  )
}

export function TransactionsPage() {
  return (
    <WalletScope>
      <TransactionsContent />
    </WalletScope>
  )
}
