import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CategoryIndicator } from '@/components/categories/CategoryIndicator'
import { CollectionCard } from '@/components/collections/CollectionCard'
import { DataTable } from '@/components/collections/DataTable'
import { Pagination } from '@/components/collections/Pagination'

const formatCurrency = (value) =>
  Number(value).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

const formatDate = (value) => {
  const [year, month, day] = value.split('-').map(Number)
  return new Intl.DateTimeFormat('pt-BR').format(
    new Date(year, month - 1, day),
  )
}

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
        <span className="font-medium text-foreground">
          {transaction.description}
        </span>
      ),
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
      render: (transaction) => formatDate(transaction.transactionDate),
    },
    {
      key: 'amount',
      header: 'Valor',
      headerClassName: 'text-right',
      cellClassName: 'whitespace-nowrap text-right font-medium tabular-nums',
      render: (transaction) => formatCurrency(transaction.amount),
    },
    {
      key: 'actions',
      header: <span className="sr-only">Ações</span>,
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
                onClick={() => void onDelete(transaction.id)}
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
      eyebrow="Lançamentos"
      title="Histórico de transações"
      description="Consulte receitas e despesas registradas nesta carteira."
    >
      <DataTable
        items={transactions}
        columns={columns}
        getItemKey={(transaction) => transaction.id}
        emptyMessage="Ainda não há transações nesta carteira."
        className="min-w-0"
        tableClassName="min-w-180"
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
