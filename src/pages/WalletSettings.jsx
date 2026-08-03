import { useState } from 'react'
import { Pencil, Plus, UserPlus } from 'lucide-react'
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog'
import { PageErrorState } from '@/components/feedback/PageErrorState'
import { PageLoader } from '@/components/feedback/PageLoader'
import { FormDialog } from '@/components/forms/FormDialog'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { AddWalletMemberForm } from '@/components/wallets/AddWalletMemberForm'
import { CreateWalletForm } from '@/components/wallets/CreateWalletForm'
import { EditWalletForm } from '@/components/wallets/EditWalletForm'
import { WalletMembersCard } from '@/components/wallets/WalletMembersCard'
import { WalletScope } from '@/components/wallets/WalletScope'
import { useWallet } from '@/context/walletContext'
import { WALLET_MEMBER_ROLES } from '@/domain/walletRoles'
import { useWalletMembers } from '@/hooks/useWalletMembers'
import { useToast } from '@/hooks/useToast'

const getErrorMessage = (error) =>
  error instanceof Error
    ? error.message
    : 'Não foi possível concluir a operação.'

function WalletSettingsContent() {
  const { currentWallet } = useWallet()
  const { toast } = useToast()
  const [activeForm, setActiveForm] = useState(null)
  const [removingMember, setRemovingMember] = useState(null)
  const [isRemovePending, setIsRemovePending] = useState(false)
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
      description:
        'Convide um usuário registrado e defina seu nível de acesso.',
    },
    create: {
      title: 'Nova carteira',
      description:
        'Carteiras separam seus dados financeiros e definem permissões.',
    },
  }

  const handleRoleChange = async (memberUserId, role) => {
    try {
      await updateMemberRole(memberUserId, role)
      toast({ message: 'Papel do membro atualizado.', variant: 'success' })
    } catch (error) {
      toast({ message: getErrorMessage(error), variant: 'error' })
    }
  }

  const confirmRemoveMember = async () => {
    if (!removingMember) return

    setIsRemovePending(true)

    try {
      await removeMember(removingMember.userId)
      toast({ message: 'Membro removido da carteira.', variant: 'success' })
      setRemovingMember(null)
    } catch (error) {
      toast({ message: getErrorMessage(error), variant: 'error' })
    } finally {
      setIsRemovePending(false)
      setRemovingMember(null)
    }
  }

  const handleFormError = (error) => {
    toast({ message: getErrorMessage(error), variant: 'error' })
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveForm('edit')}
                >
                  <Pencil aria-hidden="true" />
                  Editar carteira
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveForm('member')}
                >
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
        onRoleChange={handleRoleChange}
        onRemove={setRemovingMember}
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
          <EditWalletForm
            onSuccess={() => {
              toast({
                message: 'Carteira atualizada com sucesso.',
                variant: 'success',
              })
              closeForm()
            }}
            onError={handleFormError}
          />
        ) : null}
        {activeForm === 'member' ? (
          <AddWalletMemberForm
            onAdd={addMember}
            onSuccess={() => {
              toast({
                message: 'Membro adicionado à carteira.',
                variant: 'success',
              })
              closeForm()
            }}
            onError={handleFormError}
          />
        ) : null}
        {activeForm === 'create' ? (
          <CreateWalletForm
            onSuccess={() => {
              toast({
                message: 'Carteira criada com sucesso.',
                variant: 'success',
              })
              closeForm()
            }}
            onError={handleFormError}
          />
        ) : null}
      </FormDialog>

      <ConfirmDialog
        open={Boolean(removingMember)}
        onOpenChange={(isOpen) => {
          if (!isOpen && !isRemovePending) setRemovingMember(null)
        }}
        title="Remover membro"
        description={`“${removingMember?.user?.name ?? removingMember?.user?.email ?? 'Este membro'}” perderá o acesso a esta carteira.`}
        confirmLabel="Remover membro"
        isPending={isRemovePending}
        onConfirm={confirmRemoveMember}
      />
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
