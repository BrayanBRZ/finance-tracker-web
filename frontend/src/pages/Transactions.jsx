import { Plus } from 'lucide-react'
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog'
import { PageErrorState } from '@/components/feedback/PageErrorState'
import { PageLoader } from '@/components/feedback/PageLoader'
import { FormDialog } from '@/components/form-fields/FormDialog'
import { PageHeader } from '@/components/layout/PageHeader'
import { TransactionForm } from '@/components/transactions/TransactionForm'
import { TransactionList } from '@/components/transactions/TransactionList'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { WalletScope } from '@/components/wallets/WalletScope'
import { FINANCIAL_TYPE_OPTIONS } from '@/domain/financialTypes'
import { useTransactionsPage } from '@/hooks/transaction/useTransactionsPage'

function TransactionFilters({ categories, filters, onChange, onReset }) {
  return (
    <div className="border-border bg-card grid gap-3 rounded-(--radius) border p-4 md:grid-cols-4">
      <select
        className="border-input bg-background h-10 rounded-(--radius) border px-3 text-sm"
        value={filters.type ?? ''}
        onChange={(event) => onChange('type', event.target.value)}
        aria-label="Filtrar por tipo"
      >
        <option value="">Todos os tipos</option>
        {FINANCIAL_TYPE_OPTIONS.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>
      <select
        className="border-input bg-background h-10 rounded-(--radius) border px-3 text-sm"
        value={filters.categoryId ?? ''}
        onChange={(event) =>
          onChange(
            'categoryId',
            event.target.value ? Number(event.target.value) : null,
          )
        }
        aria-label="Filtrar por categoria"
      >
        <option value="">Todas as categorias</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <Input
        type="date"
        value={filters.startDate ?? ''}
        onChange={(event) => onChange('startDate', event.target.value)}
        aria-label="Data inicial"
      />
      <div className="flex gap-2">
        <Input
          className="min-w-0"
          type="date"
          value={filters.endDate ?? ''}
          onChange={(event) => onChange('endDate', event.target.value)}
          aria-label="Data final"
        />
        <Button type="button" variant="outline" onClick={onReset}>
          Limpar
        </Button>
      </div>
    </div>
  )
}

function TransactionsContent() {
  const {
    categories,
    filters,
    filterError,
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
    setFilter,
    resetFilters,
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
      <TransactionFilters
        categories={categories}
        filters={filters}
        onChange={setFilter}
        onReset={resetFilters}
      />
      {filterError ? (
        <p className="text-destructive text-sm" role="alert">
          {filterError}
        </p>
      ) : null}
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
        description={`A transação “${deletingTransaction?.description ?? 'Sem descrição'}” será removida permanentemente.`}
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
