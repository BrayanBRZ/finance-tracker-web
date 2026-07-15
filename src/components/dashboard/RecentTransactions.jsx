import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CategoryTypeBadge } from '@/components/categories/CategoryTypeBadge'

export function RecentTransactions({ transactions }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Transações recentes</CardTitle>
        <CardDescription>
          Ordenadas pela data financeira e, em caso de empate, pela criação do registro.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border bg-muted/40 p-5 text-sm text-muted-foreground">
            Registre uma receita ou despesa para acompanhar o resumo financeiro.
          </p>
        ) : (
          <ul className="divide-y divide-border rounded-lg border border-border">
            {transactions.map((transaction) => (
              <li key={transaction.id} className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground">{transaction.description}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {transaction.category?.name ?? 'Categoria indisponível'} · {transaction.transactionDate}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="font-medium text-foreground">{transaction.amount}</span>
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
