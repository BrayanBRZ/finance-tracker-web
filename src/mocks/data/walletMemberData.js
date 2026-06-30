import { createLocalStorageCollection } from '@/mocks/data/createLocalStorageCollection'

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

export const { read: readWalletMembers, write: writeWalletMembers } =
  createLocalStorageCollection({
    storageKey: WALLET_MEMBERS_STORAGE_KEY,
    initialData: mockWalletMembers,
  })
