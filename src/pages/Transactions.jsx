import { useState } from 'react'
import { ContentWithAside } from '@/components/layout/ContentWithAside'
import { StateCard } from '@/components/feedback/StateCard'
import { TransactionForm } from '@/components/transactions/TransactionForm'
import { TransactionList } from '@/components/transactions/TransactionList'
import { WalletScope } from '@/components/wallets/WalletScope'
import { useCategories } from '@/hooks/useCategories'
import { useTransactions } from '@/hooks/useTransactions'
import { useSession } from '@/context/sessionContext'
import { useWallet } from '@/context/walletContext'
import { WALLET_MEMBER_ROLES } from '@/domain/walletRoles'

function TransactionsContent() {
  const { session } = useSession()
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
  const isOwner = currentWallet?.role === WALLET_MEMBER_ROLES.OWNER
  const canCreate = isOwner || currentWallet?.role === WALLET_MEMBER_ROLES.COLLABORATOR
  const canEditTransaction = (transaction) =>
    isOwner ||
    (currentWallet?.role === WALLET_MEMBER_ROLES.COLLABORATOR &&
      transaction.recordedById === session?.user.id)

  const saveTransaction = async (transactionData) => {
    if (editingTransaction) {
      await updateTransaction(editingTransaction.id, transactionData)
      setEditingTransaction(null)
      return
    }

    await createTransaction(transactionData)
  }

  if (isLoading || isLoadingCategories) {
    return (
      <StateCard
        eyebrow="Carregando transações"
        title="Preparando os lançamentos da carteira"
        description="Aguarde enquanto os dados são carregados."
        role="status"
        ariaLive="polite"
      />
    )
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
        canEditTransaction={canEditTransaction}
        canDelete={isOwner}
        onEdit={setEditingTransaction}
        onDelete={removeTransaction}
      />
      {canCreate ? (
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
          description="Visualizadores podem consultar os lançamentos, mas não criar ou alterar dados."
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
      <TransactionsContent />
    </WalletScope>
  )
}
