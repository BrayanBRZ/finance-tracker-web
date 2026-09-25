import { useState } from 'react'
import { Download } from 'lucide-react'
import { DashboardSummary } from '@/components/dashboard/DashboardSummary'
import { CashFlowChart } from '@/components/dashboard/CashFlowChart'
import { ExpenseBreakdownChart } from '@/components/dashboard/ExpenseBreakdownChart'
import { FinancialChart } from '@/components/dashboard/FinancialChart'
import { RecentTransactions } from '@/components/dashboard/RecentTransactions'
import { DashboardDatePicker } from '@/components/dashboard/DashboardDatePicker'
import { PageErrorState } from '@/components/feedback/PageErrorState'
import { PageLoader } from '@/components/feedback/PageLoader'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { WalletScope } from '@/components/wallets/WalletScope'
import { useWallet } from '@/context/walletContext'
import { useDashboardData } from '@/hooks/dashboard/useDashboardData'
import { useToast } from '@/hooks/useToast'
import { downloadSummaryReport } from '@/services/reportService'
import { isValidDateInputValue, toDateInputValue } from '@/utils/dates'
import { getErrorMessage } from '@/utils/errors'

const currentMonthPeriod = () => {
  const today = new Date()
  return {
    startDate: toDateInputValue(
      new Date(today.getFullYear(), today.getMonth(), 1),
    ),
    endDate: toDateInputValue(
      new Date(today.getFullYear(), today.getMonth() + 1, 0),
    ),
  }
}

function DashboardContent({ data, period }) {
  const {
    totalIncome,
    totalExpense,
    balance,
    transactionCount,
    byCategory,
    byMonth,
    byDay,
    recentTransactions,
    isLoading,
    isReady,
    errorMessage,
    refreshDashboard,
  } = data
  const isDaily = period.startDate.slice(0, 7) === period.endDate.slice(0, 7)

  return errorMessage ? (
    <PageErrorState
      eyebrow="Não foi possível carregar o dashboard"
      description={errorMessage}
      onRetry={() => void refreshDashboard()}
    />
  ) : isLoading || !isReady ? (
    <PageLoader />
  ) : (
    <div className="space-y-6">
      <DashboardSummary
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        balance={balance}
        transactionCount={transactionCount}
      />
      <div className="grid gap-5 lg:grid-cols-2">
        <FinancialChart totalIncome={totalIncome} totalExpense={totalExpense} />
        <RecentTransactions transactions={recentTransactions} />
      </div>
      <div className="grid gap-5 lg:grid-cols-4">
        <CashFlowChart
          dailyTotals={byDay}
          monthlyTotals={byMonth}
          isDaily={isDaily}
        />
        <ExpenseBreakdownChart categoryTotals={byCategory} />
      </div>
    </div>
  )
}

export function DashboardPage() {
  const { currentWallet } = useWallet()
  const { toast } = useToast()
  const [period, setPeriod] = useState(currentMonthPeriod)
  const [isDownloading, setIsDownloading] = useState(false)
  const data = useDashboardData(period)

  const changePeriodDate = (field, value) => {
    if (!isValidDateInputValue(value)) return

    setPeriod((current) => {
      const next = { ...current, [field]: value }
      return next.startDate <= next.endDate ? next : current
    })
  }

  const downloadReport = async () => {
    if (!currentWallet || !data.isReady || isDownloading) return
    setIsDownloading(true)
    try {
      const pdf = await downloadSummaryReport({
        walletId: currentWallet.id,
        ...period,
      })
      const url = URL.createObjectURL(pdf)
      const link = document.createElement('a')
      link.href = url
      link.download = `relatorio-financeiro-${period.startDate}-a-${period.endDate}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch (error) {
      toast({ message: getErrorMessage(error), variant: 'error' })
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        className="sm:flex-wrap"
        title="Dashboard"
        description="Resumo da carteira no período selecionado"
        actions={
          <>
            <DashboardDatePicker
              label="Data inicial"
              value={period.startDate}
              maxDate={period.endDate}
              onChange={(value) => changePeriodDate('startDate', value)}
            />
            <DashboardDatePicker
              label="Data final"
              value={period.endDate}
              minDate={period.startDate}
              onChange={(value) => changePeriodDate('endDate', value)}
            />
            <Button
              className="self-end"
              type="button"
              variant="outline"
              disabled={!currentWallet || !data.isReady || isDownloading}
              onClick={() => void downloadReport()}
            >
              <Download aria-hidden="true" />
              {isDownloading ? 'Gerando PDF...' : 'Baixar relatório'}
            </Button>
          </>
        }
      />
      <WalletScope>
        <DashboardContent data={data} period={period} />
      </WalletScope>
    </div>
  )
}
