import { useState } from 'react'
import { Plus, WalletCards } from 'lucide-react'
import { PageErrorState } from '@/components/feedback/PageErrorState'
import { PageLoader } from '@/components/feedback/PageLoader'
import { FormDialog } from '@/components/form-fields/FormDialog'
import { CreateWalletForm } from '@/components/wallets/CreateWalletForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useWallet } from '@/context/walletContext'

export function WalletScope({ children }) {
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false)
  const { currentWallet, errorMessage, isLoading, refreshWallets } = useWallet()

  if (isLoading) return <PageLoader />

  if (errorMessage) {
    return (
      <PageErrorState
        eyebrow="Não foi possível carregar as carteiras"
        description={errorMessage}
        onRetry={() => void refreshWallets()}
      />
    )
  }

  if (currentWallet) return children

  return (
    <>
      <Card
        size="sm"
        role="status"
        aria-live="polite"
        className="mx-auto w-full max-w-2xl"
      >
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-(--radius)">
              <WalletCards className="size-4" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-heading font-medium">
                Crie uma carteira para continuar
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Esta funcionalidade precisa de uma carteira selecionada.
              </p>
            </div>
          </div>
          <Button type="button" onClick={() => setIsCreateFormOpen(true)}>
            <Plus aria-hidden="true" />
            Criar carteira
          </Button>
        </CardContent>
      </Card>

      <FormDialog
        open={isCreateFormOpen}
        onOpenChange={setIsCreateFormOpen}
        title="Criar primeira carteira"
        description="Carteiras separam seus dados financeiros e definem permissões."
      >
        <CreateWalletForm onSuccess={() => setIsCreateFormOpen(false)} />
      </FormDialog>
    </>
  )
}
