import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
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
import { formatCurrency } from '@/utils/formatters'

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

export function FinancialChart({ totalIncome, totalExpense }) {
  const hasData = totalIncome > 0 || totalExpense > 0
  const data = [
    {
      period: 'Carteira atual',
      income: totalIncome,
      expenses: totalExpense,
    },
  ]

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">Receitas e despesas</CardTitle>
        <CardDescription>
          Comparativo dos lançamentos da carteira selecionada.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <ChartContainer
            config={chartConfig}
            className="h-72 w-full"
            aria-label="Gráfico de receitas e despesas"
          >
            <BarChart
              accessibilityLayer
              data={data}
              margin={{ top: 12, right: 12, left: 0, bottom: 4 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="period"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis
                tickLine={false}
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
              <Bar dataKey="income" fill="var(--color-income)" radius={4} />
              <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
            </BarChart>
          </ChartContainer>
        ) : (
          <p className="text-muted-foreground rounded-lg border border-dashed p-5 text-sm">
            Registre uma receita ou despesa para acompanhar o resumo financeiro.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
