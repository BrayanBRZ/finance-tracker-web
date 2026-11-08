import { useEffect, useState } from 'react'
import { WalletContext } from '@/context/walletContext'
import { useWallets } from '@/hooks/wallet/useWallets'
import {
  addWalletMember,
  listWalletMembers,
  removeWalletMember,
  updateWalletMemberRole,
} from '@/services/walletService'
import { watchWalletTransactions } from '@/services/walletEventService'

export function WalletProvider({ children }) {
  const wallets = useWallets()
  const { currentWallet, refreshWallets } = wallets
  const walletId = currentWallet?.id
  const [transactionRevision, setTransactionRevision] = useState(0)

  useEffect(() => {
    if (!walletId) return undefined
    return watchWalletTransactions(
      walletId,
      () => setTransactionRevision((revision) => revision + 1),
      () => void refreshWallets(),
    )
  }, [walletId, refreshWallets])

  const requireCurrentWallet = () => {
    if (!wallets.currentWallet) {
      throw new Error('Selecione uma carteira antes de continuar.')
    }
    return wallets.currentWallet.id
  }

  return (
    <WalletContext.Provider
      value={{
        ...wallets,
        transactionRevision,
        listWalletMembers: ({ signal } = {}) =>
          listWalletMembers(requireCurrentWallet(), { signal }),
        addWalletMember: (data) =>
          addWalletMember(requireCurrentWallet(), data),
        updateWalletMemberRole: (memberUserId, role) =>
          updateWalletMemberRole(requireCurrentWallet(), memberUserId, role),
        removeWalletMember: (memberUserId) =>
          removeWalletMember(requireCurrentWallet(), memberUserId),
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}
