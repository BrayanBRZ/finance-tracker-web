import { Plus } from 'lucide-react'
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog'
import { PageErrorState } from '@/components/feedback/PageErrorState'
import { PageLoader } from '@/components/feedback/PageLoader'
import { FormDialog } from '@/components/form-fields/FormDialog'
import { PageHeader } from '@/components/layout/PageHeader'
import { TransactionForm } from '@/components/transactions/TransactionForm'
import { TransactionList } from '@/components/transactions/TransactionList'
import { Button } from '@/components/ui/button'
import { WalletScope } from '@/components/wallets/WalletScope'
import { useTransactionsPage } from '@/hooks/useTransactionsPage'

function TransactionsContent() {
  const {
    categories,
    isLoading,
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
  } = useTransactionsPage()

  return isLoading ? (
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
        onOpenChange={handleDeleteOpenChange}
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
