import { Pencil, Trash2 } from 'lucide-react'
import { CategoryTypeBadge } from '@/components/categories/CategoryTypeBadge'
import { Button } from '@/components/ui/button'
import { CategoryIndicator } from '@/components/categories/CategoryIndicator'
import { CollectionCard } from '@/components/collections/CollectionCard'
import { DataTable } from '@/components/collections/DataTable'
import { Pagination } from '@/components/collections/Pagination'
import { formatCurrency, formatLocalDate } from '@/utils/formatters'

export function TransactionList({
  transactions,
  page,
  totalPages,
  canEditTransaction,
  canDelete,
  onPageChange,
  onEdit,
  onDelete,
}) {
  const columns = [
    {
      key: 'description',
      header: 'Descrição',
      cellClassName: 'min-w-48',
      render: (transaction) => (
        <span className="text-foreground font-medium">
          {transaction.description?.trim() || 'Sem descrição'}
        </span>
      ),
    },
    {
      key: 'type',
      header: 'Tipo',
      cellClassName: 'whitespace-nowrap',
      render: (transaction) => <CategoryTypeBadge type={transaction.type} />,
    },
    {
      key: 'category',
      header: 'Categoria',
      cellClassName: 'min-w-44',
      render: (transaction) => (
        <CategoryIndicator category={transaction.category} />
      ),
    },
    {
      key: 'date',
      header: 'Data',
      cellClassName: 'whitespace-nowrap text-muted-foreground',
      render: (transaction) => formatLocalDate(transaction.date),
    },
    {
      key: 'amount',
      header: 'Valor',
      cellClassName: 'whitespace-nowrap font-medium tabular-nums',
      render: (transaction) => formatCurrency(transaction.amount),
    },
    {
      key: 'actions',
      header: 'Ações',
      headerClassName: 'text-right',
      cellClassName: 'whitespace-nowrap text-right',
      render: (transaction) =>
        canEditTransaction(transaction) || canDelete ? (
          <div className="flex justify-end gap-2">
            {canEditTransaction(transaction) ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onEdit(transaction)}
              >
                <Pencil aria-hidden="true" />
                Editar
              </Button>
            ) : null}
            {canDelete ? (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => onDelete(transaction)}
              >
                <Trash2 aria-hidden="true" />
                Excluir
              </Button>
            ) : null}
          </div>
        ) : null,
    },
  ]

  return (
    <CollectionCard
      className="h-full"
      contentClassName="flex min-h-0 flex-1 flex-col gap-4"
      title="Histórico de transações"
      description="Consulte receitas e despesas registradas nesta carteira."
    >
      <DataTable
        items={transactions}
        columns={columns}
        getItemKey={(transaction) => transaction.id}
        emptyMessage="Ainda não há transações nesta carteira."
        className="min-w-0"
        tableClassName="min-w-200"
      />
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        className="mt-auto"
      />
    </CollectionCard>
  )
}
