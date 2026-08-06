import { DashboardSummary } from '@/components/dashboard/DashboardSummary'
import { CashFlowChart } from '@/components/dashboard/CashFlowChart'
import { ExpenseBreakdownChart } from '@/components/dashboard/ExpenseBreakdownChart'
import { FinancialChart } from '@/components/dashboard/FinancialChart'
import { RecentTransactions } from '@/components/dashboard/RecentTransactions'
import { PageErrorState } from '@/components/feedback/PageErrorState'
import { PageLoader } from '@/components/feedback/PageLoader'
import { PageHeader } from '@/components/layout/PageHeader'
import { WalletScope } from '@/components/wallets/WalletScope'
import { useDashboardData } from '@/hooks/dashboard/useDashboardData'

function DashboardContent() {
  const {
    totalIncome,
    totalExpense,
    balance,
    transactionCount,
    byCategory,
    byMonth,
    recentTransactions,
    isLoading,
    errorMessage,
    refreshDashboard,
  } = useDashboardData()

  return isLoading ? (
    <PageLoader />
  ) : errorMessage ? (
    <PageErrorState
      eyebrow="Não foi possível carregar o dashboard"
      description={errorMessage}
      onRetry={() => void refreshDashboard()}
    />
  ) : (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Visão geral da carteira selecionada" />
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
        <CashFlowChart monthlyTotals={byMonth} />
        <ExpenseBreakdownChart categoryTotals={byCategory} />
      </div>
    </div>
  )
}

export function DashboardPage() {
  return (
    <WalletScope>
      <DashboardContent />
    </WalletScope>
  )
}
