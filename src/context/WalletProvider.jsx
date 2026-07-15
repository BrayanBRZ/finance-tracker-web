import { useCallback, useEffect, useState } from 'react'
import { useSession } from '@/context/sessionContext'
import { WalletContext } from '@/context/walletContext'
import {
  addWalletMember as addWalletMemberOperation,
  createWallet as createWalletOperation,
  listWalletMembersForUser,
  listWalletsForUser,
  removeWalletMember as removeWalletMemberOperation,
  updateWallet as updateWalletOperation,
  updateWalletMemberRole as updateWalletMemberRoleOperation,
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

const isSameId = (leftId, rightId) => String(leftId) === String(rightId)

const resolveCurrentWallet = ({ userId, wallets }) => {
  if (wallets.length === 0) {
    clearSelectedWalletId(userId)

    return null
  }

  const selectedWalletId = readSelectedWalletId(userId)
  const currentWallet =
    wallets.find((wallet) => isSameId(wallet.id, selectedWalletId)) ??
    wallets[0]

  writeSelectedWalletId({
    userId,
    walletId: currentWallet.id,
  })

  return currentWallet
}

export function WalletProvider({ children }) {
  const { session, isLoading: isSessionLoading } = useSession()
  const userId = session?.user.id
  const [wallets, setWallets] = useState([])
  const [currentWallet, setCurrentWallet] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  const resetWalletState = useCallback(() => {
    setWallets([])
    setCurrentWallet(null)
    setErrorMessage(null)
  }, [])

  const loadWalletState = useCallback(async (userId) => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const nextWallets = await listWalletsForUser(userId)
      const nextCurrentWallet = resolveCurrentWallet({
        userId,
        wallets: nextWallets,
      })

      setWallets(nextWallets)
      setCurrentWallet(nextCurrentWallet)

      return {
        wallets: nextWallets,
        currentWallet: nextCurrentWallet,
      }
    } catch (error) {
      resetWalletState()
      setErrorMessage(getErrorMessage(error))

      return {
        wallets: [],
        currentWallet: null,
      }
    } finally {
      setIsLoading(false)
    }
  }, [resetWalletState])

  const refreshWallets = useCallback(async () => {
    if (!userId) {
      resetWalletState()

      return {
        wallets: [],
        currentWallet: null,
      }
    }

    return loadWalletState(userId)
  }, [loadWalletState, resetWalletState, userId])

  const handleSelectWallet = useCallback(async (walletId) => {
    if (!userId) {
      resetWalletState()

      return null
    }

    setErrorMessage(null)

    try {
      const wallet = wallets.find((candidate) =>
        isSameId(candidate.id, walletId),
      )

      if (!wallet) {
        throw new Error('Carteira não encontrada ou sem acesso')
      }

      setCurrentWallet(wallet)
      writeSelectedWalletId({ userId, walletId: wallet.id })

      return wallet
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
      return null
    }
  }, [resetWalletState, userId, wallets])

  const handleCreateWallet = useCallback(async (walletData) => {
    if (!userId) {
      const error = new Error('Sessão expirada. Faça login novamente.')

      resetWalletState()
      setErrorMessage(error.message)

      throw error
    }

    setErrorMessage(null)

    try {
      const { wallet } = await createWalletOperation({
        userId,
        ...walletData,
      })

      setWallets((currentWallets) => {
        if (currentWallets.some((current) => isSameId(current.id, wallet.id))) {
          return currentWallets.map((current) =>
            isSameId(current.id, wallet.id) ? wallet : current,
          )
        }

        return [...currentWallets, wallet]
      })
      setCurrentWallet(wallet)
      writeSelectedWalletId({ userId, walletId: wallet.id })

      return wallet
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
      throw error
    }
  }, [resetWalletState, userId])

  const updateCurrentWallet = useCallback(async (walletData) => {
    if (!userId || !currentWallet) {
      throw new Error('Selecione uma carteira antes de continuar.')
    }

    const { wallet } = await updateWalletOperation({
      userId,
      walletId: currentWallet.id,
      ...walletData,
    })

    setWallets((currentWallets) =>
      currentWallets.map((candidate) =>
        isSameId(candidate.id, wallet.id) ? wallet : candidate,
      ),
    )
    setCurrentWallet(wallet)

    return wallet
  }, [currentWallet, userId])

  const requireCurrentWallet = useCallback(() => {
    if (!userId || !currentWallet) {
      throw new Error('Selecione uma carteira antes de continuar.')
    }

    return { userId, walletId: currentWallet.id }
  }, [currentWallet, userId])

  const listCurrentWalletMembers = useCallback(() => {
    return listWalletMembersForUser(requireCurrentWallet())
  }, [requireCurrentWallet])

  const addCurrentWalletMember = useCallback((memberData) => {
    return addWalletMemberOperation({
      ...requireCurrentWallet(),
      ...memberData,
    })
  }, [requireCurrentWallet])

  const updateCurrentWalletMemberRole = useCallback((memberUserId, role) => {
    return updateWalletMemberRoleOperation({
      ...requireCurrentWallet(),
      memberUserId,
      role,
    })
  }, [requireCurrentWallet])

  const removeCurrentWalletMember = useCallback((memberUserId) => {
    return removeWalletMemberOperation({
      ...requireCurrentWallet(),
      memberUserId,
    })
  }, [requireCurrentWallet])

  useEffect(() => {
    let isActive = true

    const syncWalletState = async () => {
      if (!userId) {
        await Promise.resolve()

        if (isActive) {
          resetWalletState()
          setIsLoading(false)
        }

        return
      }

      await loadWalletState(userId)
    }

    if (isSessionLoading) {
      return undefined
    }

    void syncWalletState()

    return () => {
      isActive = false
    }
  }, [
    isSessionLoading,
    loadWalletState,
    resetWalletState,
    userId,
  ])

  return (
    <WalletContext.Provider
      value={{
        wallets,
        currentWallet,
        hasWallets: wallets.length > 0,
        isLoading,
        errorMessage,
        refreshWallets,
        selectWallet: handleSelectWallet,
        createWallet: handleCreateWallet,
        updateWallet: updateCurrentWallet,
        listWalletMembers: listCurrentWalletMembers,
        addWalletMember: addCurrentWalletMember,
        updateWalletMemberRole: updateCurrentWalletMemberRole,
        removeWalletMember: removeCurrentWalletMember,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}
