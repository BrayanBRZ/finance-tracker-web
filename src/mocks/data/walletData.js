const WALLETS_STORAGE_KEY = '@project:wallets_data'

const mockWallets = [
  {
    id: 'wallet-personal',
    createdById: '1',
    name: 'Carteira pessoal',
    description: 'Carteira inicial para desenvolvimento.',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
]

export function readWallets() {
  const storedWallets = localStorage.getItem(WALLETS_STORAGE_KEY)

  if (!storedWallets) {
    localStorage.setItem(WALLETS_STORAGE_KEY, JSON.stringify(mockWallets))
    return mockWallets
  }

  return JSON.parse(storedWallets)
}

export function writeWallets(wallets) {
  localStorage.setItem(WALLETS_STORAGE_KEY, JSON.stringify(wallets))
}
