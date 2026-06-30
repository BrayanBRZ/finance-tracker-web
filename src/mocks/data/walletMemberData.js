const WALLET_MEMBERS_STORAGE_KEY = '@project:wallet_members_data'

const mockWalletMembers = [
  {
    walletId: 'wallet-personal',
    userId: '1',
    role: 'OWNER',
    status: 'ACTIVE',
    addedAt: '2026-01-01T00:00:00.000Z',
  },
]

export function readWalletMembers() {
  const storedWalletMembers = localStorage.getItem(WALLET_MEMBERS_STORAGE_KEY)

  if (!storedWalletMembers) {
    localStorage.setItem(
      WALLET_MEMBERS_STORAGE_KEY,
      JSON.stringify(mockWalletMembers),
    )
    return mockWalletMembers
  }

  return JSON.parse(storedWalletMembers)
}

export function writeWalletMembers(walletMembers) {
  localStorage.setItem(
    WALLET_MEMBERS_STORAGE_KEY,
    JSON.stringify(walletMembers),
  )
}
