import { readWallets, writeWallets } from '@/mocks/data/walletData'
import { isSameId } from '@/mocks/utils/id'

export function listWallets() {
  return readWallets()
}

export function findWalletById(walletId) {
  return listWallets().find((wallet) => isSameId(wallet.id, walletId))
}

export function appendWallet(wallet) {
  writeWallets([...listWallets(), wallet])
}

export function replaceWallet(nextWallet) {
  writeWallets(
    listWallets().map((wallet) =>
      isSameId(wallet.id, nextWallet.id) ? nextWallet : wallet,
    ),
  )
}
