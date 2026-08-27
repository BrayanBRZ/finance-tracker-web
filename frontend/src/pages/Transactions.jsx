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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { WalletScope } from '@/components/wallets/WalletScope'
import { FINANCIAL_TYPE_OPTIONS } from '@/domain/financialTypes'
import { useTransactionsPage } from '@/hooks/transaction/useTransactionsPage'

const ALL_TYPES_VALUE = '__all_types__'
const ALL_CATEGORIES_VALUE = '__all_categories__'

function TransactionFilters({ categories, filters, onChange, onReset }) {
  return (
    <div className="border-border bg-card grid gap-3 rounded-(--radius) border p-4 md:grid-cols-4">
      <Select
        value={filters.type ?? ALL_TYPES_VALUE}
        onValueChange={(value) =>
          onChange('type', value === ALL_TYPES_VALUE ? null : value)
        }
      >
        <SelectTrigger aria-label="Filtrar por tipo">
          <SelectValue placeholder="Todos os tipos" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_TYPES_VALUE}>Todos os tipos</SelectItem>
          {FINANCIAL_TYPE_OPTIONS.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={filters.categoryId ?? ALL_CATEGORIES_VALUE}
        onValueChange={(value) =>
          onChange('categoryId', value === ALL_CATEGORIES_VALUE ? null : value)
        }
      >
        <SelectTrigger aria-label="Filtrar por categoria">
          <SelectValue placeholder="Todas as categorias" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_CATEGORIES_VALUE}>
            Todas as categorias
          </SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
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

  return (
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
      <WalletScope>
        {isLoading ? (
          <PageLoader />
        ) : loadErrorMessage ? (
          <PageErrorState
            eyebrow="Não foi possível carregar transações"
            description={loadErrorMessage}
            onRetry={retryPageData}
          />
        ) : (
          <>
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
          </>
        )}
      </WalletScope>
    </div>
  )
}

export function TransactionsPage() {
  return <TransactionsContent />
}
