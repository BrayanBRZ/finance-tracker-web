import { Trash2 } from 'lucide-react'
import { DataTable } from '@/components/collections/DataTable'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ASSIGNABLE_WALLET_MEMBER_ROLES,
  WALLET_MEMBER_ROLE_LABELS,
  WALLET_MEMBER_ROLES,
} from '@/domain/walletRoles'

export function WalletMemberList({ members, canManage, onRoleChange, onRemove }) {
  const columns = [
    {
      key: 'member',
      header: 'Membro',
      cellClassName: 'min-w-56',
      render: (member) => (
        <div>
          <p className="font-medium text-foreground">
            {member.user?.name ?? 'Usuário indisponível'}
          </p>
          <p className="text-xs text-muted-foreground">
            {member.user?.email ?? member.userId}
          </p>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Papel',
      cellClassName: 'w-44',
      render: (member) => {
        const isOwner = member.role === WALLET_MEMBER_ROLES.OWNER

        return canManage && !isOwner ? (
          <Select
            value={member.role}
            onValueChange={(role) => void onRoleChange(member.userId, role)}
          >
            <SelectTrigger
              className="w-36"
              aria-label={`Papel de ${member.user?.name ?? 'membro'}`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ASSIGNABLE_WALLET_MEMBER_ROLES.map((role) => (
                <SelectItem key={role} value={role}>
                  {WALLET_MEMBER_ROLE_LABELS[role]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <span className="text-sm font-medium text-muted-foreground">
            {WALLET_MEMBER_ROLE_LABELS[member.role]}
          </span>
        )
      },
    },
    {
      key: 'actions',
      header: <span className="sr-only">Ações</span>,
      headerClassName: 'text-right',
      cellClassName: 'w-32 text-right',
      render: (member) => {
        const isOwner = member.role === WALLET_MEMBER_ROLES.OWNER

        return canManage && !isOwner ? (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => void onRemove(member.userId)}
          >
            <Trash2 aria-hidden="true" />
            Remover
          </Button>
        ) : null
      },
    },
  ]

  return (
    <DataTable
      items={members}
      columns={columns}
      getItemKey={(member) => member.userId}
      emptyMessage="Esta carteira ainda não possui membros ativos."
      className="h-full flex-1"
      tableClassName="min-w-150"
    />
  )
}
