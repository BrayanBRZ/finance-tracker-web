import { useCallback, useEffect, useState } from 'react'
import { useSession } from '@/context/sessionContext'
import { useWallet } from '@/context/walletContext'
import { useAsyncScopeGuard } from '@/hooks/useAsyncScopeGuard'

const getErrorMessage = (error) =>
  error instanceof Error
    ? error.message
    : 'Não foi possível carregar os membros da carteira.'

export function useWalletMembers() {
  const { session } = useSession()
  const {
    currentWallet,
    listWalletMembers,
    addWalletMember,
    updateWalletMemberRole,
    removeWalletMember,
  } = useWallet()
  const userId = session?.user.id
  const walletId = currentWallet?.id
  const [members, setMembers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const {
    beginRequest,
    captureScope,
    invalidateRequests,
    isRequestCurrent,
    isScopeCurrent,
  } = useAsyncScopeGuard(JSON.stringify([userId ?? null, walletId ?? null]))

  const refreshMembers = useCallback(async () => {
    const request = beginRequest()

    if (!userId || !walletId) {
      if (isRequestCurrent(request)) {
        setMembers([])
        setIsLoading(false)
        setErrorMessage(null)
      }

      return []
    }

    setIsLoading(true)
    setErrorMessage(null)

    try {
      const nextMembers = await listWalletMembers()

      if (!isRequestCurrent(request)) return []

      setMembers(nextMembers)
      return nextMembers
    } catch (error) {
      if (!isRequestCurrent(request)) return []

      setMembers([])
      setErrorMessage(getErrorMessage(error))
      return []
    } finally {
      if (isRequestCurrent(request)) {
        setIsLoading(false)
      }
    }
  }, [beginRequest, isRequestCurrent, listWalletMembers, userId, walletId])

  useEffect(() => {
    const loadMembers = async () => {
      await Promise.resolve()
      await refreshMembers()
    }

    void loadMembers()
  }, [refreshMembers])

  const addMember = async (memberData) => {
    const mutationScope = captureScope()
    const { member } = await addWalletMember(memberData)

    if (isScopeCurrent(mutationScope)) {
      invalidateRequests()
      setIsLoading(false)
      setMembers((currentMembers) => [...currentMembers, member])
    }

    return member
  }

  const updateMemberRole = async (memberUserId, role) => {
    const mutationScope = captureScope()

    const { member } = await updateWalletMemberRole(memberUserId, role)

    if (isScopeCurrent(mutationScope)) {
      invalidateRequests()
      setIsLoading(false)
      setMembers((currentMembers) =>
        currentMembers.map((currentMember) =>
          currentMember.userId === member.userId ? member : currentMember,
        ),
      )
    }
  }

  const removeMember = async (memberUserId) => {
    const mutationScope = captureScope()

    await removeWalletMember(memberUserId)

    if (isScopeCurrent(mutationScope)) {
      invalidateRequests()
      setIsLoading(false)
      setMembers((currentMembers) =>
        currentMembers.filter((member) => member.userId !== memberUserId),
      )
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
