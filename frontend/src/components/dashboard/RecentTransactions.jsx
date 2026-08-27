import { CollectionCard } from '@/components/collections/CollectionCard'
import { DataList } from '@/components/collections/DataList'
import { CategoryTypeBadge } from '@/components/categories/CategoryTypeBadge'
import { formatCurrency, formatLocalDate } from '@/utils/formatters'

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
                      ? 'bg-primary size-1.5 rounded-full'
                      : 'bg-destructive size-1.5 rounded-full'
                  }
                  aria-hidden="true"
                />
                <p className="text-foreground truncate text-sm font-medium">
                  {transaction.description}
                </p>
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                {transaction.category?.name ?? 'Sem categoria'} ·{' '}
                {formatLocalDate(transaction.date)}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="text-foreground text-sm font-medium">
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
