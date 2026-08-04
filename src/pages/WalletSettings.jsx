import { Pencil, Plus, Trash2, UserPlus } from 'lucide-react'
import { ConfirmDialog } from '@/components/feedback/ConfirmDialog'
import { PageErrorState } from '@/components/feedback/PageErrorState'
import { PageLoader } from '@/components/feedback/PageLoader'
import { FormDialog } from '@/components/form-fields/FormDialog'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { AddWalletMemberForm } from '@/components/wallets/AddWalletMemberForm'
import { CreateWalletForm } from '@/components/wallets/CreateWalletForm'
import { EditWalletForm } from '@/components/wallets/EditWalletForm'
import { WalletMembersCard } from '@/components/wallets/WalletMembersCard'
import { WalletScope } from '@/components/wallets/WalletScope'
import { useWalletSettingsPage } from '@/hooks/useWalletSettingsPage'

function WalletSettingsContent() {
  const {
    members,
    isLoading,
    errorMessage,
    refreshMembers,
    addMember,
    currentWallet,
    isOwner,
    formContent,
    activeForm,
    removingMember,
    isRemovePending,
    isDeleteWalletOpen,
    isDeleteWalletPending,
    setActiveForm,
    setRemovingMember,
    setIsDeleteWalletOpen,
    closeForm,
    handleRoleChange,
    confirmRemoveMember,
    handleFormError,
    handleEditWalletSuccess,
    handleAddMemberSuccess,
    handleCreateWalletSuccess,
    confirmDeleteWallet,
    handleRemoveMemberOpenChange,
    handleDeleteWalletOpenChange,
  } = useWalletSettingsPage()

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
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setIsDeleteWalletOpen(true)}
                >
                  <Trash2 aria-hidden="true" />
                  Excluir carteira
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
            onSuccess={handleEditWalletSuccess}
            onError={handleFormError}
          />
        ) : null}
        {activeForm === 'member' ? (
          <AddWalletMemberForm
            onAdd={addMember}
            onSuccess={handleAddMemberSuccess}
            onError={handleFormError}
          />
        ) : null}
        {activeForm === 'create' ? (
          <CreateWalletForm
            onSuccess={handleCreateWalletSuccess}
            onError={handleFormError}
          />
        ) : null}
      </FormDialog>
      <ConfirmDialog
        open={Boolean(removingMember)}
        onOpenChange={handleRemoveMemberOpenChange}
        title="Remover membro"
        description={`“${removingMember?.user?.name ?? removingMember?.user?.email ?? 'Este membro'}” perderá o acesso a esta carteira.`}
        confirmLabel="Remover membro"
        isPending={isRemovePending}
        onConfirm={confirmRemoveMember}
      />
      <ConfirmDialog
        open={isDeleteWalletOpen}
        onOpenChange={handleDeleteWalletOpenChange}
        title="Excluir carteira"
        description={`A carteira “${currentWallet?.name ?? ''}”, seus membros e todos os seus lançamentos serão removidos permanentemente.`}
        confirmLabel="Excluir carteira"
        isPending={isDeleteWalletPending}
        onConfirm={confirmDeleteWallet}
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
