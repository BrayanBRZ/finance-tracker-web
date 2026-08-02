import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { PageLoader } from '@/components/feedback/PageLoader'
import { StateCard } from '@/components/feedback/StateCard'
import { AddWalletMemberForm } from '@/components/wallets/AddWalletMemberForm'
import { WalletMemberList } from '@/components/wallets/WalletMemberList'
import { useWallet } from '@/context/walletContext'
import { WALLET_MEMBER_ROLES } from '@/domain/walletRoles'
import { useWalletMembers } from '@/hooks/useWalletMembers'

export function WalletMembersCard() {
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
  const canManage = currentWallet?.role === WALLET_MEMBER_ROLES.OWNER

  if (isLoading) {
    return <PageLoader className="min-h-64" label="Carregando membros..." />
  }

  if (errorMessage) {
    return (
      <StateCard
        eyebrow="Não foi possível carregar membros"
        title="Algo saiu do trilho"
        description={errorMessage}
        role="alert"
        action={{ label: 'Tentar novamente', onClick: () => void refreshMembers() }}
      />
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Membros da carteira</CardTitle>
        <CardDescription>
          Membros ativos podem acessar esta carteira conforme seu papel.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <WalletMemberList
          members={members}
          canManage={canManage}
          onRoleChange={updateMemberRole}
          onRemove={removeMember}
        />
        {canManage ? <AddWalletMemberForm onAdd={addMember} /> : null}
      </CardContent>
    </Card>
  )
}
