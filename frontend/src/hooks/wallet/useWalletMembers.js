import { useCallback, useEffect, useState } from 'react'
import { useWallet } from '@/context/walletContext'
import { useAsyncScopeGuard } from '@/hooks/shared/useAsyncScopeGuard'
import { isAbortError } from '@/services/api/client'

const getErrorMessage = (error) =>
  error instanceof Error ? error.message : 'Não foi possível carregar os membros da carteira.'

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
  const { beginRequest, captureScope, invalidateRequests, isRequestCurrent, isScopeCurrent } =
    useAsyncScopeGuard(JSON.stringify([walletId ?? null]))

  const refreshMembers = useCallback(
    async ({ signal } = {}) => {
      const request = beginRequest()
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
        if (!isRequestCurrent(request)) return []
        setMembers(nextMembers)
        return nextMembers
      } catch (error) {
        if (isAbortError(error) || !isRequestCurrent(request)) return []
        setMembers([])
        setErrorMessage(getErrorMessage(error))
        return []
      } finally {
        if (isRequestCurrent(request)) setIsLoading(false)
      }
    },
    [beginRequest, isRequestCurrent, listWalletMembers, walletId],
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
    const scope = captureScope()
    const member = await addWalletMember(data)
    if (isScopeCurrent(scope)) {
      invalidateRequests()
      setMembers((current) => [...current, member])
    }
    return member
  }

  const updateMemberRole = async (memberUserId, role) => {
    const scope = captureScope()
    const member = await updateWalletMemberRole(memberUserId, role)
    if (isScopeCurrent(scope)) {
      invalidateRequests()
      setMembers((current) =>
        current.map((item) => (item.user.id === member.user.id ? member : item)),
      )
    }
    return member
  }

  const removeMember = async (memberUserId) => {
    const scope = captureScope()
    await removeWalletMember(memberUserId)
    if (isScopeCurrent(scope)) {
      invalidateRequests()
      setMembers((current) => current.filter((item) => item.user.id !== memberUserId))
    }
  }

  return { members, isLoading, errorMessage, refreshMembers, addMember, updateMemberRole, removeMember }
}
