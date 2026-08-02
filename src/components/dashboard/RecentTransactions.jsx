import { CollectionCard } from '@/components/collections/CollectionCard'
import { DataList } from '@/components/collections/DataList'
import { CategoryTypeBadge } from '@/components/categories/CategoryTypeBadge'

const formatCurrency = (value) =>
  Number(value).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

export function RecentTransactions({ transactions }) {
  const recentTransactions = transactions.slice(0, 5)

  return (
    <CollectionCard
      className="h-full"
      title="Atividades recentes"
      description="Últimos lançamentos da carteira selecionada."
    >
      <DataList
        items={recentTransactions}
        getItemKey={(transaction) => transaction.id}
        emptyMessage="Registre uma receita ou despesa para acompanhar o resumo financeiro."
        compact
        renderItem={(transaction) => (
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={
                    transaction.type === 'INCOME'
                      ? 'size-1.5 rounded-full bg-primary'
                      : 'size-1.5 rounded-full bg-destructive'
                  }
                  aria-hidden="true"
                />
                <p className="truncate text-sm font-medium text-foreground">
                  {transaction.description}
                </p>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {transaction.category?.name ?? 'Sem categoria'} ·{' '}
                {transaction.transactionDate}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="text-sm font-medium text-foreground">
                {formatCurrency(transaction.amount)}
              </span>
              <CategoryTypeBadge type={transaction.type} />
            </div>
          </div>
        )}
      />
    </CollectionCard>
  )
}
