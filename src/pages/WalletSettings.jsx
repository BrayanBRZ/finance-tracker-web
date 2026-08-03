import { useState } from 'react'
import { Pencil, Plus, UserPlus } from 'lucide-react'
import { PageErrorState } from '@/components/feedback/PageErrorState'
import { PageLoader } from '@/components/feedback/PageLoader'
import { PageHeader } from '@/components/layout/PageHeader'
import { FormDialog } from '@/components/forms/FormDialog'
import { AddWalletMemberForm } from '@/components/wallets/AddWalletMemberForm'
import { EditWalletForm } from '@/components/wallets/EditWalletForm'
import { CreateWalletForm } from '@/components/wallets/CreateWalletForm'
import { WalletMembersCard } from '@/components/wallets/WalletMembersCard'
import { WalletScope } from '@/components/wallets/WalletScope'
import { Button } from '@/components/ui/button'
import { useWallet } from '@/context/walletContext'
import { WALLET_MEMBER_ROLES } from '@/domain/walletRoles'
import { useWalletMembers } from '@/hooks/useWalletMembers'

function WalletSettingsContent() {
  const { currentWallet } = useWallet()
  const [activeForm, setActiveForm] = useState(null)
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
  const closeForm = () => setActiveForm(null)

  const formContent = {
    edit: {
      title: 'Editar carteira',
      description: 'Atualize o nome e a descrição visíveis aos membros.',
    },
    member: {
      title: 'Adicionar membro',
      description: 'Convide um usuário registrado e defina seu nível de acesso.',
    },
    create: {
      title: 'Nova carteira',
      description: 'Carteiras separam seus dados financeiros e definem permissões.',
    },
  }

  return isLoading ? (
    <PageLoader />
  ) : errorMessage ? (
    <PageErrorState
      eyebrow="Não foi possível carregar membros"
      description={errorMessage}
      onRetry={() => void refreshMembers()}
    />
  ) : (
    <div className="flex h-full min-h-0 flex-col gap-6">
      <PageHeader
        title="Carteira"
        description="Gerencie informações, membros e acessos da carteira."
        actions={
          <>
            {isOwner ? (
              <>
                <Button type="button" variant="outline" onClick={() => setActiveForm('edit')}>
                  <Pencil aria-hidden="true" />
                  Editar carteira
                </Button>
                <Button type="button" variant="outline" onClick={() => setActiveForm('member')}>
                  <UserPlus aria-hidden="true" />
                  Adicionar membro
                </Button>
              </>
            ) : null}
            <Button type="button" onClick={() => setActiveForm('create')}>
              <Plus aria-hidden="true" />
              Nova carteira
            </Button>
          </>
        }
      />
      <WalletMembersCard
        members={members}
        canManage={isOwner}
        onRoleChange={updateMemberRole}
        onRemove={removeMember}
      />

      <FormDialog
        open={Boolean(activeForm)}
        onOpenChange={(isOpen) => {
          if (!isOpen) closeForm()
        }}
        title={formContent[activeForm]?.title}
        description={formContent[activeForm]?.description}
      >
        {activeForm === 'edit' ? (
          <EditWalletForm onSuccess={closeForm} />
        ) : null}
        {activeForm === 'member' ? (
          <AddWalletMemberForm onAdd={addMember} onSuccess={closeForm} />
        ) : null}
        {activeForm === 'create' ? (
          <CreateWalletForm onSuccess={closeForm} />
        ) : null}
      </FormDialog>
    </div>
  )
}

export function WalletSettingsPage() {
  return (
    <WalletScope>
      <WalletSettingsContent />
    </WalletScope>
  )
}
