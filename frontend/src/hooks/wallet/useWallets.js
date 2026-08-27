import { useCallback, useEffect, useState } from 'react'
import { useSession } from '@/context/sessionContext'
import { isAbortError } from '@/services/api/client'
import {
  addWalletMember,
  createWallet,
  leaveWallet,
  listWalletMembers,
  listWallets,
  removeWallet,
  removeWalletMember,
  updateWallet,
  updateWalletMemberRole,
} from '@/services/walletService'
import {
  clearSelectedWalletId,
  readSelectedWalletId,
  writeSelectedWalletId,
} from '@/storage/walletPreferenceStorage'

const getErrorMessage = (error) =>
  error instanceof Error
    ? error.message
    : 'Não foi possível carregar as carteiras.'

const sameId = (left, right) => left === right

const resolveCurrentWallet = (userId, wallets) => {
  if (wallets.length === 0) {
    clearSelectedWalletId(userId)
    return null
  }

  const preferredId = readSelectedWalletId(userId)

  const wallet =
    wallets.find((item) => sameId(item.id, preferredId)) ?? wallets[0]

  writeSelectedWalletId({
    userId,
    walletId: wallet.id,
  })

  return wallet
}

export function useWallets() {
  const { session, isLoading: isSessionLoading } = useSession()

  const userId = session?.user.id

  const [wallets, setWallets] = useState([])
  const [currentWallet, setCurrentWallet] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  const requireCurrentWallet = useCallback(() => {
    if (!currentWallet) {
      throw new Error('Selecione uma carteira antes de continuar.')
    }

    return currentWallet.id
  }, [currentWallet])

  const reset = useCallback(() => {
    setWallets([])
    setCurrentWallet(null)
    setIsLoading(false)
    setErrorMessage(null)
  }, [])

  const refreshWallets = useCallback(
    async ({ signal } = {}) => {
      if (!userId) {
        reset()
        return []
      }

      setIsLoading(true)
      setErrorMessage(null)

      try {
        const nextWallets = await listWallets({ signal })

        setWallets(nextWallets)

        setCurrentWallet(resolveCurrentWallet(userId, nextWallets))

        return nextWallets
      } catch (error) {
        if (isAbortError(error)) {
          return []
        }

        setWallets([])
        setCurrentWallet(null)
        setErrorMessage(getErrorMessage(error))

        return []
      } finally {
        if (!signal?.aborted) {
          setIsLoading(false)
        }
      }
    },
    [reset, userId],
  )

  useEffect(() => {
    if (isSessionLoading) {
      return undefined
    }

    const controller = new AbortController()

    const load = async () => {
      await Promise.resolve()

      await refreshWallets({
        signal: controller.signal,
      })
    }

    void load()

    return () => {
      controller.abort()
    }
  }, [isSessionLoading, refreshWallets])

  const selectWallet = useCallback(
    (walletId) => {
      const wallet = wallets.find((item) => sameId(item.id, walletId))

      if (!wallet || !userId) {
        return null
      }

      setCurrentWallet(wallet)

      writeSelectedWalletId({
        userId,
        walletId: wallet.id,
      })

      return wallet
    },
    [userId, wallets],
  )

  const createCurrentWallet = useCallback(
    async (data) => {
      const wallet = await createWallet(data)

      setWallets((current) => [...current, wallet])

      setCurrentWallet(wallet)

      writeSelectedWalletId({
        userId,
        walletId: wallet.id,
      })

      return wallet
    },
    [userId],
  )

  const updateCurrentWallet = useCallback(
    async (data) => {
      const walletId = requireCurrentWallet()

      const wallet = await updateWallet(walletId, data)

      setWallets((current) =>
        current.map((item) => (sameId(item.id, wallet.id) ? wallet : item)),
      )

      setCurrentWallet(wallet)

      return wallet
    },
    [requireCurrentWallet],
  )

  const removeCurrentWallet = useCallback(async () => {
    const walletId = requireCurrentWallet()

    await removeWallet(walletId)

    const nextWallets = wallets.filter((item) => !sameId(item.id, walletId))

    setWallets(nextWallets)

    setCurrentWallet(resolveCurrentWallet(userId, nextWallets))
  }, [requireCurrentWallet, userId, wallets])

  const leaveCurrentWallet = useCallback(async () => {
    const walletId = requireCurrentWallet()

    await leaveWallet(walletId)

    const nextWallets = wallets.filter((item) => !sameId(item.id, walletId))

    setWallets(nextWallets)

    setCurrentWallet(resolveCurrentWallet(userId, nextWallets))
  }, [requireCurrentWallet, userId, wallets])

  const listCurrentWalletMembers = useCallback(
    ({ signal } = {}) => listWalletMembers(requireCurrentWallet(), { signal }),
    [requireCurrentWallet],
  )

  const addCurrentWalletMember = useCallback(
    (data) => addWalletMember(requireCurrentWallet(), data),
    [requireCurrentWallet],
  )

  const updateCurrentWalletMemberRole = useCallback(
    (memberUserId, role) =>
      updateWalletMemberRole(requireCurrentWallet(), memberUserId, role),
    [requireCurrentWallet],
  )

  const removeCurrentWalletMember = useCallback(
    (memberUserId) => removeWalletMember(requireCurrentWallet(), memberUserId),
    [requireCurrentWallet],
  )

  return {
    wallets,
    currentWallet,
    hasWallets: wallets.length > 0,
    isLoading,
    errorMessage,
    refreshWallets,
    selectWallet,
    createWallet: createCurrentWallet,
    updateWallet: updateCurrentWallet,
    removeWallet: removeCurrentWallet,
    leaveWallet: leaveCurrentWallet,
    listWalletMembers: listCurrentWalletMembers,
    addWalletMember: addCurrentWalletMember,
    updateWalletMemberRole: updateCurrentWalletMemberRole,
    removeWalletMember: removeCurrentWalletMember,
  }
}
