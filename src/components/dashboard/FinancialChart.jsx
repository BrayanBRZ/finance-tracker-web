import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
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

export function FinancialChart({ totalIncome, totalExpenses }) {
  const data = [
    {
      period: 'Carteira atual',
      Receitas: totalIncome,
      Despesas: totalExpenses,
    },
  ]

  return (
    <Card className="h-full py-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Receitas e despesas</CardTitle>
        <CardDescription>
          Comparativo dos lançamentos da carteira selecionada.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72" aria-label="Gráfico de receitas e despesas">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 4 }}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="period" tickLine={false} axisLine={false} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatCurrency(value)}
                width={88}
              />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="Receitas" fill="var(--primary)" radius={[5, 5, 0, 0]} />
              <Bar dataKey="Despesas" fill="var(--destructive)" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
