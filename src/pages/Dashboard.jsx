import { useSession } from '@/context/sessionContext'
import { useWallet } from '@/context/walletContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ContentWithAside } from '@/components/layout/ContentWithAside'
import { CreateWalletForm } from '@/components/wallets/CreateWalletForm'
import { WalletScope } from '@/components/wallets/WalletScope'

export function DashboardPage() {
  const { session } = useSession()
  const { currentWallet } = useWallet()

  return (
    <WalletScope>
      <ContentWithAside>
        <Card className="p-4">
          <CardHeader>
            <p className="text-sm font-medium text-primary">
              Dashboard da carteira
            </p>
            <CardTitle className="text-3xl">
              Olá, {session?.user.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="max-w-2xl text-muted-foreground">
              A carteira atual é {currentWallet?.name}. A estrutura financeira
              do dashboard será carregada somente dentro deste contexto.
            </p>
          </CardContent>
        </Card>

        <CreateWalletForm title="Criar outra carteira" />
      </ContentWithAside>
    </WalletScope>
  )
}
