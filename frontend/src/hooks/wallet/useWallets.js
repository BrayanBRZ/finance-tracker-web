import { useCallback, useEffect, useState } from 'react'
import { useSession } from '@/context/sessionContext'
import { useAsyncScopeGuard } from '@/hooks/shared/useAsyncScopeGuard'
import { isAbortError } from '@/services/api/client'
import {
  createWallet,
  listWallets,
  removeWallet,
  updateWallet,
} from '@/services/walletService'
import {
  clearSelectedWalletId,
  readSelectedWalletId,
  writeSelectedWalletId,
} from '@/storage/walletPreferenceStorage'

const getErrorMessage = (error) =>
  error instanceof Error ? error.message : 'Não foi possível carregar as carteiras.'

const sameId = (left, right) => Number(left) === Number(right)

const resolveCurrentWallet = (userId, wallets) => {
  if (wallets.length === 0) {
    clearSelectedWalletId(userId)
    return null
  }

  const preferredId = readSelectedWalletId(userId)
  const wallet = wallets.find((item) => sameId(item.id, preferredId)) ?? wallets[0]
  writeSelectedWalletId({ userId, walletId: wallet.id })
  return wallet
}

export function useWallets() {
  const { session, isLoading: isSessionLoading } = useSession()
  const userId = session?.user.id
  const [wallets, setWallets] = useState([])
  const [currentWallet, setCurrentWallet] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const { beginRequest, captureScope, invalidateRequests, isRequestCurrent, isScopeCurrent } =
    useAsyncScopeGuard(JSON.stringify([userId ?? null]))

  const reset = useCallback(() => {
    invalidateRequests()
    setWallets([])
    setCurrentWallet(null)
    setIsLoading(false)
    setErrorMessage(null)
  }, [invalidateRequests])

  const refreshWallets = useCallback(
    async ({ signal } = {}) => {
      const request = beginRequest()
      if (!userId) {
        reset()
        return []
      }

      setIsLoading(true)
      setErrorMessage(null)
      try {
        const nextWallets = await listWallets({ signal })
        if (!isRequestCurrent(request)) return []

        setWallets(nextWallets)
        setCurrentWallet(resolveCurrentWallet(userId, nextWallets))
        return nextWallets
      } catch (error) {
        if (isAbortError(error) || !isRequestCurrent(request)) return []
        setWallets([])
        setCurrentWallet(null)
        setErrorMessage(getErrorMessage(error))
        return []
      } finally {
        if (isRequestCurrent(request)) setIsLoading(false)
      }
    },
    [beginRequest, isRequestCurrent, reset, userId],
  )

  useEffect(() => {
    if (isSessionLoading) return undefined
    const controller = new AbortController()
    const load = async () => {
      await Promise.resolve()
      await refreshWallets({ signal: controller.signal })
    }
    void load()
    return () => controller.abort()
  }, [isSessionLoading, refreshWallets])

  const selectWallet = useCallback(
    (walletId) => {
      const wallet = wallets.find((item) => sameId(item.id, walletId))
      if (!wallet || !userId) return null
      invalidateRequests()
      setCurrentWallet(wallet)
      writeSelectedWalletId({ userId, walletId: wallet.id })
      return wallet
    },
    [invalidateRequests, userId, wallets],
  )

  const createCurrentWallet = useCallback(
    async (data) => {
      const scope = captureScope()
      const wallet = await createWallet(data)
      if (isScopeCurrent(scope)) {
        invalidateRequests()
        setWallets((current) => [...current, wallet])
        setCurrentWallet(wallet)
        writeSelectedWalletId({ userId, walletId: wallet.id })
      }
      return wallet
    },
    [captureScope, invalidateRequests, isScopeCurrent, userId],
  )

  const updateCurrentWallet = useCallback(
    async (data) => {
      if (!currentWallet) throw new Error('Selecione uma carteira antes de continuar.')
      const scope = captureScope()
      const wallet = await updateWallet(currentWallet.id, data)
      if (isScopeCurrent(scope)) {
        setWallets((current) => current.map((item) => (sameId(item.id, wallet.id) ? wallet : item)))
        setCurrentWallet(wallet)
      }
      return wallet
    },
    [captureScope, currentWallet, isScopeCurrent],
  )

  const removeCurrentWallet = useCallback(async () => {
    if (!currentWallet) throw new Error('Selecione uma carteira antes de continuar.')
    const scope = captureScope()
    const walletId = currentWallet.id
    await removeWallet(walletId)
    if (!isScopeCurrent(scope)) return

    const nextWallets = wallets.filter((item) => !sameId(item.id, walletId))
    setWallets(nextWallets)
    setCurrentWallet(resolveCurrentWallet(userId, nextWallets))
  }, [captureScope, currentWallet, isScopeCurrent, userId, wallets])

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
  }
}
