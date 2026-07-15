import { useMemo } from 'react'
import { DashboardSummary } from '@/components/dashboard/DashboardSummary'
import { RecentTransactions } from '@/components/dashboard/RecentTransactions'
import { StateCard } from '@/components/feedback/StateCard'
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

  if (isLoading) {
    return (
      <StateCard
        eyebrow="Carregando dashboard"
        title="Calculando o resumo da carteira"
        description="Aguarde enquanto consolidamos os lançamentos da carteira atual."
        role="status"
        ariaLive="polite"
      />
    )
  }

  if (errorMessage) {
    return (
      <StateCard
        eyebrow="Não foi possível carregar o dashboard"
        title="Algo saiu do trilho"
        description={errorMessage}
        role="alert"
        action={{
          label: 'Tentar novamente',
          onClick: () => void refreshTransactions(),
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">Dashboard da carteira</p>
        <h1 className="font-heading text-3xl text-foreground">
          Visão financeira atual
        </h1>
      </div>
      <DashboardSummary
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        currentBalance={currentBalance}
      />
      <RecentTransactions transactions={transactions} />
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
