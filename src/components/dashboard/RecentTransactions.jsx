import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CategoryTypeBadge } from '@/components/categories/CategoryTypeBadge'

const formatCurrency = (value) =>
  Number(value).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

export function RecentTransactions({ transactions }) {
  return (
    <Card className="h-full shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Atividades recentes</CardTitle>
        <CardDescription>
          Últimos lançamentos da carteira selecionada.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="rounded-(--radius) border border-dashed border-border bg-muted/40 p-5 text-sm text-muted-foreground">
            Registre uma receita ou despesa para acompanhar o resumo financeiro.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {transactions.slice(0, 5).map((transaction) => (
              <li key={transaction.id} className="flex items-center justify-between gap-4 py-3">
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
                    {transaction.category?.name ?? 'Sem categoria'} · {transaction.transactionDate}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {formatCurrency(transaction.amount)}
                  </span>
                  <CategoryTypeBadge type={transaction.type} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
