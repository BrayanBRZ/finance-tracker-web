import { useCallback, useEffect, useState } from 'react'
import { useWallet } from '@/context/walletContext'
import { isAbortError } from '@/services/api/client'

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
  const walletId = currentWallet?.id
  const [members, setMembers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const refreshMembers = useCallback(
    async ({ signal } = {}) => {
      if (!walletId) {
        setMembers([])
        setErrorMessage(null)
        setIsLoading(false)
        return []
      }

      setIsLoading(true)
      setErrorMessage(null)
      try {
        const nextMembers = await listWalletMembers({ signal })
        setMembers(nextMembers)
        return nextMembers
      } catch (error) {
        if (isAbortError(error)) return []
        setMembers([])
        setErrorMessage(getErrorMessage(error))
        return []
      } finally {
        if (!signal?.aborted) setIsLoading(false)
      }
    },
    [listWalletMembers, walletId],
  )

  useEffect(() => {
    const controller = new AbortController()
    const load = async () => {
      await Promise.resolve()
      await refreshMembers({ signal: controller.signal })
    }
    void load()
    return () => controller.abort()
  }, [refreshMembers])

  const addMember = async (data) => {
    const member = await addWalletMember(data)
    setMembers((current) => [...current, member])
    return member
  }

  const updateMemberRole = async (memberUserId, role) => {
    const member = await updateWalletMemberRole(memberUserId, role)
    setMembers((current) =>
      current.map((item) => (item.user.id === member.user.id ? member : item)),
    )
    return member
  }

  const removeMember = async (memberUserId) => {
    await removeWalletMember(memberUserId)
    setMembers((current) =>
      current.filter((item) => item.user.id !== memberUserId),
    )
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
