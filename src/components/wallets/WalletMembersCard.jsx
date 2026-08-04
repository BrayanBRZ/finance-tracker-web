import { CollectionCard } from '@/components/collections/CollectionCard'
import { WalletMemberList } from '@/components/wallets/WalletMemberList'
import { useWallet } from '@/context/walletContext'
import { WALLET_MEMBER_ROLES } from '@/domain/walletRoles'

export function WalletMembersCard({
  members,
  canManage,
  onRemove,
  onRoleChange,
}) {
  const { currentWallet } = useWallet()
  const canManageMembers =
    canManage ?? currentWallet?.role === WALLET_MEMBER_ROLES.OWNER

  return (
    <CollectionCard
      className="min-h-0 flex-1"
      contentClassName="flex min-h-0 flex-1 flex-col"
      title="Membros da carteira"
      description="Membros ativos podem acessar esta carteira conforme seu papel."
    >
      <WalletMemberList
        members={members}
        canManage={canManageMembers}
        onRoleChange={onRoleChange}
        onRemove={onRemove}
      />
    </CollectionCard>
  )
}
