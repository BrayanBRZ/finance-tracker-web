import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
    <Card>
      <CardHeader>
        <p className="text-sm font-medium text-primary">Lançamentos</p>
        <CardTitle className="text-2xl">Transações da carteira</CardTitle>
        <CardDescription>
          Registros ordenados da data financeira mais recente para a mais antiga.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border bg-muted/40 p-5 text-sm text-muted-foreground">
            Ainda não há transações nesta carteira.
          </p>
        ) : (
          <ul className="divide-y divide-border rounded-lg border border-border">
            {transactions.map((transaction) => (
              <li key={transaction.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-foreground">{transaction.description}</p>
                    <CategoryTypeBadge type={transaction.type} />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {transaction.category?.name ?? 'Categoria indisponível'} · {transaction.transactionDate}
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    Valor: {transaction.amount}
                  </p>
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
