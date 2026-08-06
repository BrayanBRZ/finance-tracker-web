import {
  ArrowDownRight,
  ArrowUpRight,
  Landmark,
  ReceiptText,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/utils/formatters'

const summaryItems = [
  {
    key: 'balance',
    label: 'Saldo atual',
    description: 'Disponível na carteira',
    icon: Landmark,
    tone: 'text-foreground',
  },
  {
    key: 'income',
    label: 'Receitas',
    description: 'Entradas registradas',
    icon: ArrowUpRight,
    tone: 'text-primary',
  },
  {
    key: 'expenses',
    label: 'Despesas',
    description: 'Saídas registradas',
    icon: ArrowDownRight,
    tone: 'text-destructive',
  },
  {
    key: 'count',
    label: 'Lançamentos',
    description: 'Registros na carteira',
    icon: ReceiptText,
    tone: 'text-foreground',
  },
]

export function DashboardSummary({
  totalIncome,
  totalExpense,
  balance,
  transactionCount,
}) {
  const values = {
    income: formatCurrency(totalIncome),
    expenses: formatCurrency(totalExpense),
    balance: formatCurrency(balance),
    count: transactionCount,
  }

  return (
    <section
      className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4"
      aria-label="Resumo financeiro"
    >
      {summaryItems.map((item) => {
        const Icon = item.icon

        return (
          <Card key={item.key}>
            <CardContent>
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <Icon
                  className={`size-4 ${item.tone}`}
                  strokeWidth={1.7}
                  aria-hidden="true"
                />
              </div>
              <p
                className={`mt-6 text-2xl font-semibold tracking-tight ${item.tone}`}
              >
                {values[item.key]}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {item.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </section>
  )
}
