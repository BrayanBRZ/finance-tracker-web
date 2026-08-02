import {
  Bar,
  BarChart,
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

const formatCurrency = (value) =>
  Number(value).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

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

export function FinancialChart({ totalIncome, totalExpenses }) {
  const data = [
    {
      period: 'Carteira atual',
      income: totalIncome,
      expenses: totalExpenses,
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
            <Bar dataKey="income" fill="var(--color-income)" radius={4} />
            <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
