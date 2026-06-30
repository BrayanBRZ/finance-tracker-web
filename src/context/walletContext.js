import { createContext, useContext } from 'react'

export const WalletContext = createContext(null)

export const useWallet = () => {
  const context = useContext(WalletContext)

  if (!context) {
    throw new Error('useWallet deve ser usado dentro do WalletProvider')
  }

  return context
}
