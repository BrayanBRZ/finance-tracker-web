import { ContentWithAside } from '@/components/layout/ContentWithAside'
import { StateCard } from '@/components/feedback/StateCard'
import { EditWalletForm } from '@/components/wallets/EditWalletForm'
import { WalletMembersCard } from '@/components/wallets/WalletMembersCard'
import { WalletScope } from '@/components/wallets/WalletScope'
import { useWallet } from '@/context/walletContext'
import { WALLET_MEMBER_ROLES } from '@/domain/walletRoles'

function WalletSettingsContent() {
  const { currentWallet } = useWallet()
  const isOwner = currentWallet?.role === WALLET_MEMBER_ROLES.OWNER

  return (
    <ContentWithAside>
      <WalletMembersCard />
      {isOwner ? (
        <EditWalletForm />
      ) : (
        <StateCard
          eyebrow="Acesso de leitura"
          title="Apenas o proprietário pode editar a carteira"
          description="Você pode consultar os membros, mas não alterar informações ou acessos."
          role="status"
          ariaLive="polite"
        />
      )}
    </ContentWithAside>
  )
}

export function WalletSettingsPage() {
  return (
    <WalletScope>
      <WalletSettingsContent />
    </WalletScope>
  )
}
