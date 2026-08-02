import { useMemo } from 'react'
import { Cell, Pie, PieChart } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { FINANCIAL_TYPES } from '@/domain/financialTypes'

const chartColors = [
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--chart-1)',
]

const formatCurrency = (value) =>
  Number(value).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

const chartConfig = {
  amount: {
    label: 'Despesas',
  },
}

export function ExpenseBreakdownChart({ transactions }) {
  const data = useMemo(() => {
    const totalsByCategory = transactions.reduce((totals, transaction) => {
      if (transaction.type !== FINANCIAL_TYPES.EXPENSE) return totals

      const categoryName = transaction.category?.name ?? 'Sem categoria'
      totals.set(categoryName, (totals.get(categoryName) ?? 0) + transaction.amount)
      return totals
    }, new Map())

    return [...totalsByCategory.entries()]
      .sort(([, firstAmount], [, secondAmount]) => secondAmount - firstAmount)
      .map(([category, amount], index) => ({
        category,
        amount,
        fill: chartColors[index % chartColors.length],
      }))
  }, [transactions])

  return (
    <Card className="h-full shadow-sm lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-base">Despesas por categoria</CardTitle>
        <CardDescription>
          Distribuição das saídas registradas na carteira atual.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="rounded-(--radius) border border-dashed border-border bg-muted/40 p-5 text-sm text-muted-foreground">
            Registre uma despesa para visualizar a distribuição por categoria.
          </p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="h-72 w-full"
            aria-label="Gráfico de despesas por categoria"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value) => formatCurrency(value)}
                  />
                }
              />
              <Pie
                data={data}
                dataKey="amount"
                nameKey="category"
                innerRadius={58}
                outerRadius={90}
                paddingAngle={3}
                strokeWidth={2}
              >
                {data.map((item) => (
                  <Cell key={item.category} fill={item.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
