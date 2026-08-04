import { useMemo } from 'react'
import { Cell, Pie, PieChart } from 'recharts'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from '@/components/ui/chart'
import { getCategoryColor } from '@/lib/categoryAppearance'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { FINANCIAL_TYPES } from '@/domain/financialTypes'
import { formatCurrency } from '@/utils/formatters'

function ExpenseTooltip({ active, payload }) {
  if (!active || !payload?.length) return null

  const item = payload[0]

  return (
    <div className="flex min-w-36 items-center gap-2 rounded-(--radius) border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
      <span
        className="size-2.5 shrink-0 rounded-[2px]"
        style={{ backgroundColor: item.payload.fill }}
        aria-hidden="true"
      />
      <span className="min-w-0 flex-1 truncate text-muted-foreground">
        {item.payload.category}
      </span>
      <span className="font-mono font-medium text-foreground tabular-nums">
        {formatCurrency(item.value)}
      </span>
    </div>
  )
}

export function ExpenseBreakdownChart({ transactions }) {
  const data = useMemo(() => {
    const totalsByCategory = transactions.reduce((totals, transaction) => {
      if (transaction.type !== FINANCIAL_TYPES.EXPENSE) return totals

      const categoryKey = transaction.category?.id ?? '__uncategorized__'
      const currentCategory = totals.get(categoryKey) ?? {
        category: transaction.category?.name ?? 'Sem categoria',
        amount: 0,
        fill: getCategoryColor(transaction.category?.color),
      }

      currentCategory.amount += transaction.amount
      totals.set(categoryKey, currentCategory)
      return totals
    }, new Map())

    return [...totalsByCategory.values()].sort(
      (firstCategory, secondCategory) =>
        secondCategory.amount - firstCategory.amount,
    )
  }, [transactions])
  const chartConfig = useMemo(
    () =>
      Object.fromEntries(
        data.map((item) => [
          item.category,
          {
            label: item.category,
            color: item.fill,
          },
        ]),
      ),
    [data],
  )

  return (
    <Card className="h-full lg:col-span-2">
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
              <ChartTooltip cursor={false} content={<ExpenseTooltip />} />
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
              <ChartLegend
                content={
                  <ChartLegendContent
                    nameKey="category"
                    className="flex-wrap gap-x-3 gap-y-1"
                  />
                }
              />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
