import { useCallback, useEffect, useState } from 'react'
import { useWallet } from '@/context/walletContext'

const getErrorMessage = (error) =>
  error instanceof Error
    ? error.message
    : 'Não foi possível carregar os membros da carteira.'

export function useWalletMembers() {
  const {
    currentWallet,
    listWalletMembers,
    addWalletMember,
    updateWalletMemberRole,
    removeWalletMember,
  } = useWallet()
  const [members, setMembers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  const refreshMembers = useCallback(async () => {
    if (!currentWallet) {
      setMembers([])
      setErrorMessage(null)
      return []
    }

    setIsLoading(true)
    setErrorMessage(null)

    try {
      const nextMembers = await listWalletMembers()
      setMembers(nextMembers)
      return nextMembers
    } catch (error) {
      setMembers([])
      setErrorMessage(getErrorMessage(error))
      return []
    } finally {
      setIsLoading(false)
    }
  }, [currentWallet, listWalletMembers])

  useEffect(() => {
    const loadMembers = async () => {
      await Promise.resolve()
      await refreshMembers()
    }

    void loadMembers()
  }, [refreshMembers])

  const addMember = async (memberData) => {
    const { member } = await addWalletMember(memberData)
    setMembers((currentMembers) => [...currentMembers, member])
    return member
  }

  const updateMemberRole = async (memberUserId, role) => {
    try {
      const { member } = await updateWalletMemberRole(memberUserId, role)
      setMembers((currentMembers) =>
        currentMembers.map((currentMember) =>
          currentMember.userId === member.userId ? member : currentMember,
        ),
      )
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  const removeMember = async (memberUserId) => {
    try {
      await removeWalletMember(memberUserId)
      setMembers((currentMembers) =>
        currentMembers.filter((member) => member.userId !== memberUserId),
      )
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  return {
    members,
    isLoading,
    errorMessage,
    refreshMembers,
    addMember,
    updateMemberRole,
    removeMember,
  }
}
