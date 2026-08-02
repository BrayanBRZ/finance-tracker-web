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
  if (members.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Esta carteira ainda não possui membros ativos.
      </p>
    )
  }

  return (
    <ul className="divide-y divide-border rounded-(--radius) border border-border">
      {members.map((member) => {
        const isOwner = member.role === WALLET_MEMBER_ROLES.OWNER

        return (
          <li
            key={member.userId}
            className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium text-foreground">
                {member.user?.name ?? 'Usuário indisponível'}
              </p>
              <p className="text-sm text-muted-foreground">
                {member.user?.email ?? member.userId}
              </p>
            </div>

            {canManage && !isOwner ? (
              <div className="flex items-center gap-2">
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
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => void onRemove(member.userId)}
                >
                  Remover
                </Button>
              </div>
            ) : (
              <span className="text-sm font-medium text-muted-foreground">
                {WALLET_MEMBER_ROLE_LABELS[member.role]}
              </span>
            )}
          </li>
        )
      })}
    </ul>
  )
}
