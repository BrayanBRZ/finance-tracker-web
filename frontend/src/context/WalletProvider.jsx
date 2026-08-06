import { WalletContext } from '@/context/walletContext'
import { useWallets } from '@/hooks/wallet/useWallets'
import {
  addWalletMember,
  listWalletMembers,
  removeWalletMember,
  updateWalletMemberRole,
} from '@/services/walletService'

export function WalletProvider({ children }) {
  const wallets = useWallets()

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
        listWalletMembers: ({ signal } = {}) =>
          listWalletMembers(requireCurrentWallet(), { signal }),
        addWalletMember: (data) => addWalletMember(requireCurrentWallet(), data),
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
