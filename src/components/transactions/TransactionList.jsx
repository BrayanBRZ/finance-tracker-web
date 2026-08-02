import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card'
import { CategoryTypeBadge } from '@/components/categories/CategoryTypeBadge'

export function TransactionList({
  transactions,
  canEditTransaction,
  canDelete,
  onEdit,
  onDelete,
}) {
  return (
    <Card className="h-full min-h-0">
      <CardHeader>
        <p className="text-sm font-medium text-primary">Lançamentos</p>
      </CardHeader>
      <CardContent className="min-h-0 flex-1">
        {transactions.length === 0 ? (
          <p className="rounded-(--radius) border border-dashed border-border bg-muted/40 p-5 text-sm text-muted-foreground">
            Ainda não há transações nesta carteira.
          </p>
        ) : (
          <ul className="scrollbar-minimal h-full overflow-y-auto divide-y divide-border rounded-(--radius) border border-border">
            {transactions.map((transaction) => (
              <li key={transaction.id} className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-foreground">{transaction.description}</p>
                    <CategoryTypeBadge type={transaction.type} />
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm">
                    <span className="text-muted-foreground">
                      {transaction.category?.name ?? 'Categoria indisponível'} · {transaction.transactionDate}
                    </span>
                    <span className="font-medium text-foreground">
                      Valor: {transaction.amount}
                    </span>
                  </div>
                </div>
                {canEditTransaction(transaction) || canDelete ? (
                  <div className="flex gap-2">
                    {canEditTransaction(transaction) ? (
                      <Button type="button" variant="outline" size="sm" onClick={() => onEdit(transaction)}>
                        <Pencil aria-hidden="true" /> Editar
                      </Button>
                    ) : null}
                    {canDelete ? (
                      <Button type="button" variant="destructive" size="sm" onClick={() => void onDelete(transaction.id)}>
                        <Trash2 aria-hidden="true" /> Excluir
                      </Button>
                    ) : null}
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
