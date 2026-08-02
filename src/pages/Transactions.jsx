import { useState } from 'react'
import { Plus } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { PageErrorState } from '@/components/feedback/PageErrorState'
import { PageLoader } from '@/components/feedback/PageLoader'
import { FormDialog } from '@/components/forms/FormDialog'
import { TransactionForm } from '@/components/transactions/TransactionForm'
import { TransactionList } from '@/components/transactions/TransactionList'
import { Button } from '@/components/ui/button'
import { WalletScope } from '@/components/wallets/WalletScope'
import { useCategories } from '@/hooks/useCategories'
import { useTransactions } from '@/hooks/useTransactions'
import { useWallet } from '@/context/walletContext'
import { WALLET_MEMBER_ROLES } from '@/domain/walletRoles'

const TRANSACTIONS_PER_PAGE = 10

function TransactionsContent() {
  const { currentWallet } = useWallet()
  const [editingTransaction, setEditingTransaction] = useState(null)
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
    if (editingTransaction) {
      await updateTransaction(editingTransaction.id, transactionData)
      setEditingTransaction(null)
      setIsFormOpen(false)
      return
    }

    await createTransaction(transactionData)
    changePage(1)
    setIsFormOpen(false)
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
        onDelete={removeTransaction}
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
