import { ContentWithAside } from '@/components/layout/ContentWithAside'
import { PageLoader } from '@/components/feedback/PageLoader'
import { PageHeader } from '@/components/layout/PageHeader'
import { StateCard } from '@/components/feedback/StateCard'
import { EditWalletForm } from '@/components/wallets/EditWalletForm'
import { CreateWalletForm } from '@/components/wallets/CreateWalletForm'
import { WalletMembersCard } from '@/components/wallets/WalletMembersCard'
import { WalletScope } from '@/components/wallets/WalletScope'
import { useWallet } from '@/context/walletContext'
import { WALLET_MEMBER_ROLES } from '@/domain/walletRoles'
import { useWalletMembers } from '@/hooks/useWalletMembers'

function WalletSettingsContent() {
  const { currentWallet } = useWallet()
  const {
    members,
    isLoading,
    errorMessage,
    refreshMembers,
    addMember,
    updateMemberRole,
    removeMember,
  } = useWalletMembers()
  const isOwner = currentWallet?.role === WALLET_MEMBER_ROLES.OWNER

  if (isLoading) {
    return <PageLoader label="Carregando membros da carteira..." />
  }

  if (errorMessage) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Carteiras"
          description="Gerencie informações, membros e acessos da carteira."
        />
        <StateCard
          eyebrow="Não foi possível carregar membros"
          title="Algo saiu do trilho"
          description={errorMessage}
          role="alert"
          action={{ label: 'Tentar novamente', onClick: () => void refreshMembers() }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Carteiras"
        description="Gerencie informações, membros e acessos da carteira."
      />
      <ContentWithAside>
        <WalletMembersCard
          members={members}
          canManage={isOwner}
          onAdd={addMember}
          onRoleChange={updateMemberRole}
          onRemove={removeMember}
        />
        <div className="space-y-6">
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
          <CreateWalletForm title="Criar outra carteira" />
        </div>
      </ContentWithAside>
    </div>
  )
}

export function WalletSettingsPage() {
  return <WalletScope><WalletSettingsContent /></WalletScope>
}
