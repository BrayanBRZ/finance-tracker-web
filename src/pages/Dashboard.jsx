import { useMemo } from 'react'
import { DashboardSummary } from '@/components/dashboard/DashboardSummary'
import { CashFlowChart } from '@/components/dashboard/CashFlowChart'
import { ExpenseBreakdownChart } from '@/components/dashboard/ExpenseBreakdownChart'
import { FinancialChart } from '@/components/dashboard/FinancialChart'
import { RecentTransactions } from '@/components/dashboard/RecentTransactions'
import { PageErrorState } from '@/components/feedback/PageErrorState'
import { PageLoader } from '@/components/feedback/PageLoader'
import { PageHeader } from '@/components/layout/PageHeader'
import { WalletScope } from '@/components/wallets/WalletScope'
import { FINANCIAL_TYPES } from '@/domain/financialTypes'
import { useTransactions } from '@/hooks/useTransactions'

function DashboardContent() {
  const { transactions, isLoading, errorMessage, refreshTransactions } =
    useTransactions()

  const { totalIncome, totalExpenses, currentBalance } = useMemo(() => {
    const totals = transactions.reduce(
      (currentTotals, transaction) => {
        if (transaction.type === FINANCIAL_TYPES.INCOME) {
          currentTotals.totalIncome += transaction.amount
        } else if (transaction.type === FINANCIAL_TYPES.EXPENSE) {
          currentTotals.totalExpenses += transaction.amount
        }

        return currentTotals
      },
      { totalIncome: 0, totalExpenses: 0 },
    )

    return {
      ...totals,
      currentBalance: totals.totalIncome - totals.totalExpenses,
    }
  }, [transactions])

  return isLoading ? (
    <PageLoader />
  ) : errorMessage ? (
    <PageErrorState
      eyebrow="Não foi possível carregar o dashboard"
      description={errorMessage}
      onRetry={() => void refreshTransactions()}
    />
  ) : (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Visão geral da carteira selecionada"
      />

      <DashboardSummary
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        currentBalance={currentBalance}
        transactionCount={transactions.length}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <FinancialChart
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
        />
        <RecentTransactions transactions={transactions} />
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <CashFlowChart transactions={transactions} />
        <ExpenseBreakdownChart transactions={transactions} />
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
