import { useState } from 'react'
import { Plus } from 'lucide-react'
import { PageErrorState } from '@/components/feedback/PageErrorState'
import { PageLoader } from '@/components/feedback/PageLoader'
import { StateCard } from '@/components/feedback/StateCard'
import { FormDialog } from '@/components/forms/FormDialog'
import { PageHeader } from '@/components/layout/PageHeader'
import { CreateWalletForm } from '@/components/wallets/CreateWalletForm'
import { Button } from '@/components/ui/button'
import { useWallet } from '@/context/walletContext'

export function WalletScope({ children }) {
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false)
  const {
    currentWallet,
    errorMessage,
    isLoading,
    refreshWallets,
  } = useWallet()

  return isLoading ? (
    <PageLoader />
  ) : errorMessage ? (
    <PageErrorState
      eyebrow="Não foi possível carregar as carteiras"
      description={errorMessage}
      onRetry={() => void refreshWallets()}
    />
  ) : !currentWallet ? (
    <div className="flex h-full min-h-0 flex-col gap-6">
      <PageHeader
        title="Carteiras"
        description="Crie uma carteira para começar a organizar suas finanças."
        actions={
          <Button type="button" onClick={() => setIsCreateFormOpen(true)}>
            <Plus aria-hidden="true" />
            Criar carteira
          </Button>
        }
      />
      <StateCard
        eyebrow="Nenhuma carteira encontrada"
        title="Crie uma carteira para começar"
        description="Carteiras separam seus dados financeiros e definem o contexto de dashboard, categorias, transações e membros."
      />

      <FormDialog
        open={isCreateFormOpen}
        onOpenChange={setIsCreateFormOpen}
        title="Criar primeira carteira"
        description="Carteiras separam seus dados financeiros e definem permissões."
      >
        <CreateWalletForm onSuccess={() => setIsCreateFormOpen(false)} />
      </FormDialog>
    </div>
  ) : (
    children
  )
}
