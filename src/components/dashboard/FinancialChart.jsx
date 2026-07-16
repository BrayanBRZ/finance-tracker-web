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
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Receitas e despesas</CardTitle>
        <CardDescription>
          Comparativo dos lançamentos da carteira selecionada.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64" aria-label="Gráfico de receitas e despesas">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="period" tickLine={false} axisLine={false} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatCurrency(value)}
                width={88}
              />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="Receitas" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Despesas" fill="var(--destructive)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
