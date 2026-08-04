import { useMemo } from 'react'
import { FINANCIAL_TYPES } from '@/domain/financialTypes'
import { useTransactions } from '@/hooks/useTransactions'

export function useDashboardData() {
  const transactionsState = useTransactions()
  const metrics = useMemo(() => {
    const totals = transactionsState.transactions.reduce(
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
  }, [transactionsState.transactions])

  return { ...transactionsState, ...metrics }
}
