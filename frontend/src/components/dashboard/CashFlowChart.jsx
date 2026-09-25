import { useMemo } from 'react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
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
  income: { label: 'Receitas', color: 'var(--chart-1)' },
  expenses: { label: 'Despesas', color: 'var(--chart-2)' },
}

export function CashFlowChart({ dailyTotals, monthlyTotals, isDaily }) {
  const data = useMemo(
    () =>
      isDaily
        ? dailyTotals.map((item) => ({
            period: item.date.slice(8) + '/' + item.date.slice(5, 7),
            income: item.income,
            expenses: item.expense,
          }))
        : monthlyTotals.map((item) => ({
            period: item.month,
            income: item.income,
            expenses: item.expense,
          })),
    [dailyTotals, monthlyTotals, isDaily],
  )
  const hasData = data.some((item) => item.income > 0 || item.expenses > 0)

  return (
    <Card className="h-full lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-base">Evolução financeira</CardTitle>
        <CardDescription>
          Receitas e despesas agrupadas por {isDaily ? 'dia' : 'mês'}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <p className="border-border bg-muted/40 text-muted-foreground rounded-(--radius) border border-dashed p-5 text-sm">
            Registre lançamentos para acompanhar a evolução financeira.
          </p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="h-72 w-full"
            aria-label="Gráfico de evolução financeira"
          >
            <AreaChart
              accessibilityLayer
              data={data}
              margin={{ left: 0, right: 12 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="period"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                minTickGap={16}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={formatCurrency}
                width={88}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent formatter={formatCurrency} />}
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
