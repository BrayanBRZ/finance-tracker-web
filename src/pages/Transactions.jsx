import { useState } from 'react'
import { ContentWithAside } from '@/components/layout/ContentWithAside'
import { PageHeader } from '@/components/layout/PageHeader'
import { PageLoader } from '@/components/feedback/PageLoader'
import { StateCard } from '@/components/feedback/StateCard'
import { TransactionForm } from '@/components/transactions/TransactionForm'
import { TransactionList } from '@/components/transactions/TransactionList'
import { WalletScope } from '@/components/wallets/WalletScope'
import { useCategories } from '@/hooks/useCategories'
import { useTransactions } from '@/hooks/useTransactions'
import { useWallet } from '@/context/walletContext'
import { WALLET_MEMBER_ROLES } from '@/domain/walletRoles'

function TransactionsContent() {
  const { currentWallet } = useWallet()
  const [editingTransaction, setEditingTransaction] = useState(null)
  const { categories, isLoading: isLoadingCategories } = useCategories()
  const {
    transactions,
    isLoading,
    errorMessage,
    refreshTransactions,
    createTransaction,
    updateTransaction,
    removeTransaction,
  } = useTransactions()
  const canManageTransactions =
    currentWallet?.role === WALLET_MEMBER_ROLES.OWNER ||
    currentWallet?.role === WALLET_MEMBER_ROLES.EDITOR

  const saveTransaction = async (transactionData) => {
    if (editingTransaction) {
      await updateTransaction(editingTransaction.id, transactionData)
      setEditingTransaction(null)
      return
    }

    await createTransaction(transactionData)
  }

  if (isLoading || isLoadingCategories) {
    return <PageLoader label="Carregando transações..." />
  }

  if (errorMessage) {
    return (
      <StateCard
        eyebrow="Não foi possível carregar transações"
        title="Algo saiu do trilho"
        description={errorMessage}
        role="alert"
        action={{ label: 'Tentar novamente', onClick: () => void refreshTransactions() }}
      />
    )
  }

  return (
    <ContentWithAside>
      <TransactionList
        transactions={transactions}
        canEditTransaction={() => canManageTransactions}
        canDelete={canManageTransactions}
        onEdit={setEditingTransaction}
        onDelete={removeTransaction}
      />
      {canManageTransactions ? (
        <TransactionForm
          categories={categories}
          transaction={editingTransaction}
          onSubmit={saveTransaction}
          onCancel={() => setEditingTransaction(null)}
        />
      ) : (
        <StateCard
          eyebrow="Acesso de leitura"
          title="Você não pode registrar transações"
          description="Visualizadores podem apenas consultar os lançamentos."
          role="status"
          ariaLive="polite"
        />
      )}
    </ContentWithAside>
  )
}

export function TransactionsPage() {
  return (
    <WalletScope>
      <div className="space-y-6">
        <PageHeader
          title="Transações"
          description="Gerencie receitas e despesas da carteira selecionada."
        />
        <TransactionsContent />
      </div>
    </WalletScope>
  )
}
