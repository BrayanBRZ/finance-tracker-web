import { ContentWithAside } from '@/components/layout/ContentWithAside'
import { PageLoader } from '@/components/feedback/PageLoader'
import { StateCard } from '@/components/feedback/StateCard'
import { CreateWalletForm } from '@/components/wallets/CreateWalletForm'
import { useWallet } from '@/context/walletContext'

export function WalletScope({ children }) {
  const {
    currentWallet,
    errorMessage,
    isLoading,
    refreshWallets,
  } = useWallet()

  if (isLoading) {
    return <PageLoader label="Carregando carteira..." />
  }

  if (errorMessage) {
    return (
      <StateCard
        eyebrow="Não foi possível carregar as carteiras"
        title="Algo saiu do trilho"
        description={errorMessage}
        role="alert"
        action={{
          label: 'Tentar novamente',
          onClick: () => void refreshWallets(),
        }}
      />
    )
  }

  if (!currentWallet) {
    return (
      <ContentWithAside>
        <StateCard
          eyebrow="Nenhuma carteira encontrada"
          title="Crie uma carteira para começar"
          description="Carteiras separam seus dados financeiros e definem o contexto de dashboard, categorias, transações e membros."
        />

        <CreateWalletForm title="Criar primeira carteira" />
      </ContentWithAside>
    )
  }

  return children
}
