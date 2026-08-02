import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AddWalletMemberForm } from '@/components/wallets/AddWalletMemberForm'
import { WalletMemberList } from '@/components/wallets/WalletMemberList'
import { useWallet } from '@/context/walletContext'
import { WALLET_MEMBER_ROLES } from '@/domain/walletRoles'

export function WalletMembersCard({
  members,
  canManage,
  onAdd,
  onRemove,
  onRoleChange,
}) {
  const { currentWallet } = useWallet()
  const canManageMembers =
    canManage ?? currentWallet?.role === WALLET_MEMBER_ROLES.OWNER

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
          canManage={canManageMembers}
          onRoleChange={onRoleChange}
          onRemove={onRemove}
        />
        {canManageMembers ? <AddWalletMemberForm onAdd={onAdd} /> : null}
      </CardContent>
    </Card>
  )
}
