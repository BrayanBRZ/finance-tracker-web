import { useMemo } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
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

const formatCurrency = (value) =>
  Number(value).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

const formatDate = (value) =>
  new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
  }).format(new Date(`${value}T00:00:00`))

const chartConfig = {
  income: {
    label: 'Receitas',
    color: 'var(--chart-1)',
  },
  expenses: {
    label: 'Despesas',
    color: 'var(--chart-2)',
  },
}

export function CashFlowChart({ transactions }) {
  const data = useMemo(() => {
    const totalsByDate = transactions.reduce((totals, transaction) => {
      const current = totals.get(transaction.transactionDate) ?? {
        income: 0,
        expenses: 0,
      }

      if (transaction.type === FINANCIAL_TYPES.INCOME) {
        current.income += transaction.amount
      } else if (transaction.type === FINANCIAL_TYPES.EXPENSE) {
        current.expenses += transaction.amount
      }

      totals.set(transaction.transactionDate, current)
      return totals
    }, new Map())

    return [...totalsByDate.entries()]
      .sort(([firstDate], [secondDate]) => firstDate.localeCompare(secondDate))
      .map(([date, totals]) => ({
        date: formatDate(date),
        ...totals,
      }))
  }, [transactions])

  return (
    <Card className="h-full lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-base">Evolução financeira</CardTitle>
        <CardDescription>
          Receitas e despesas agrupadas pela data dos lançamentos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="rounded-(--radius) border border-dashed border-border bg-muted/40 p-5 text-sm text-muted-foreground">
            Registre lançamentos para acompanhar a evolução financeira.
          </p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="h-72 w-full"
            aria-label="Gráfico de evolução financeira"
          >
            <AreaChart accessibilityLayer data={data} margin={{ left: 0, right: 12 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatCurrency(value)}
                width={88}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value) => formatCurrency(value)}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Area
                dataKey="income"
                type="natural"
                fill="var(--color-income)"
                fillOpacity={0.2}
                stroke="var(--color-income)"
                strokeWidth={2}
              />
              <Area
                dataKey="expenses"
                type="natural"
                fill="var(--color-expenses)"
                fillOpacity={0.16}
                stroke="var(--color-expenses)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
