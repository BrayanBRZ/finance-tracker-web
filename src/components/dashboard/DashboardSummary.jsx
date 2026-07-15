import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const summaryItems = [
  { key: 'income', label: 'Receitas', tone: 'text-primary' },
  { key: 'expenses', label: 'Despesas', tone: 'text-destructive' },
  { key: 'balance', label: 'Saldo atual', tone: 'text-foreground' },
]

export function DashboardSummary({ totalIncome, totalExpenses, currentBalance }) {
  const values = {
    income: totalIncome,
    expenses: totalExpenses,
    balance: currentBalance,
  }

  return (
    <section className="grid gap-4 sm:grid-cols-3" aria-label="Resumo financeiro">
      {summaryItems.map((item) => (
        <Card key={item.key}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-muted-foreground">
              {item.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-3xl font-semibold ${item.tone}`}>
              {values[item.key]}
            </p>
          </CardContent>
        </Card>
      ))}
    </section>
  )
}
