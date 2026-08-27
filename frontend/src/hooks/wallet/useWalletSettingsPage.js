import { useState } from 'react'
import { useWallet } from '@/context/walletContext'
import { WALLET_MEMBER_ROLES } from '@/domain/walletRoles'
import { useToast } from '@/hooks/useToast'
import { useWalletMembers } from '@/hooks/wallet/useWalletMembers'
import { getErrorMessage } from '@/utils/errors'

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
    description:
      'Carteiras separam seus dados financeiros e definem permissões.',
  },
}

export function useWalletSettingsPage() {
  const { currentWallet, leaveWallet, removeWallet } = useWallet()
  const { toast } = useToast()
  const [activeForm, setActiveForm] = useState(null)
  const [removingMember, setRemovingMember] = useState(null)
  const [isRemovePending, setIsRemovePending] = useState(false)
  const [isDeleteWalletPending, setIsDeleteWalletPending] = useState(false)
  const [isDeleteWalletOpen, setIsDeleteWalletOpen] = useState(false)
  const [isLeaveWalletPending, setIsLeaveWalletPending] = useState(false)
  const [isLeaveWalletOpen, setIsLeaveWalletOpen] = useState(false)
  const membersState = useWalletMembers()
  const isOwner = currentWallet?.currentUserRole === WALLET_MEMBER_ROLES.OWNER

  const closeForm = () => setActiveForm(null)
  const handleRoleChange = async (memberUserId, role) => {
    try {
      await membersState.updateMemberRole(memberUserId, role)
      toast({ message: 'Papel do membro atualizado.', variant: 'success' })
    } catch (error) {
      toast({ message: getErrorMessage(error), variant: 'error' })
    }
  }
  const confirmRemoveMember = async () => {
    if (!removingMember) return

    setIsRemovePending(true)
    try {
      await membersState.removeMember(removingMember.user.id)
      toast({ message: 'Membro removido da carteira.', variant: 'success' })
    } catch (error) {
      toast({ message: getErrorMessage(error), variant: 'error' })
    } finally {
      setIsRemovePending(false)
      setRemovingMember(null)
    }
  }
  const handleFormError = (error) =>
    toast({ message: getErrorMessage(error), variant: 'error' })
  const handleEditWalletSuccess = () => {
    toast({ message: 'Carteira atualizada com sucesso.', variant: 'success' })
    closeForm()
  }
  const handleAddMemberSuccess = () => {
    toast({ message: 'Membro adicionado à carteira.', variant: 'success' })
    closeForm()
  }
  const handleCreateWalletSuccess = () => {
    toast({ message: 'Carteira criada com sucesso.', variant: 'success' })
    closeForm()
  }
  const confirmDeleteWallet = async () => {
    setIsDeleteWalletPending(true)
    try {
      await removeWallet()
      toast({ message: 'Carteira excluída com sucesso.', variant: 'success' })
      setIsDeleteWalletOpen(false)
    } catch (error) {
      toast({ message: getErrorMessage(error), variant: 'error' })
      setIsDeleteWalletOpen(false)
    } finally {
      setIsDeleteWalletPending(false)
    }
  }
  const confirmLeaveWallet = async () => {
    setIsLeaveWalletPending(true)
    try {
      await leaveWallet()
      toast({ message: 'Você saiu da carteira.', variant: 'success' })
      setIsLeaveWalletOpen(false)
    } catch (error) {
      toast({ message: getErrorMessage(error), variant: 'error' })
      setIsLeaveWalletOpen(false)
    } finally {
      setIsLeaveWalletPending(false)
    }
  }
  const handleRemoveMemberOpenChange = (isOpen) => {
    if (!isOpen && !isRemovePending) setRemovingMember(null)
  }
  const handleDeleteWalletOpenChange = (isOpen) => {
    if (!isOpen && !isDeleteWalletPending) setIsDeleteWalletOpen(false)
  }
  const handleLeaveWalletOpenChange = (isOpen) => {
    if (!isOpen && !isLeaveWalletPending) setIsLeaveWalletOpen(false)
  }

  return {
    ...membersState,
    currentWallet,
    isOwner,
    formContent,
    activeForm,
    removingMember,
    isRemovePending,
    isDeleteWalletOpen,
    isDeleteWalletPending,
    isLeaveWalletOpen,
    isLeaveWalletPending,
    setActiveForm,
    setRemovingMember,
    setIsDeleteWalletOpen,
    setIsLeaveWalletOpen,
    closeForm,
    handleRoleChange,
    confirmRemoveMember,
    handleFormError,
    handleEditWalletSuccess,
    handleAddMemberSuccess,
    handleCreateWalletSuccess,
    confirmDeleteWallet,
    confirmLeaveWallet,
    handleRemoveMemberOpenChange,
    handleDeleteWalletOpenChange,
    handleLeaveWalletOpenChange,
  }
}
