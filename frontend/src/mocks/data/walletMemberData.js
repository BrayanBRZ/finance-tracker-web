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
  {
    walletId: 'wallet-personal',
    userId: '2',
    role: 'EDITOR',
    status: 'ACTIVE',
    addedAt: '2026-01-02T00:00:00.000Z',
  },
  {
    walletId: 'wallet-personal',
    userId: '3',
    role: 'VIEWER',
    status: 'ACTIVE',
    addedAt: '2026-01-03T00:00:00.000Z',
  },
  {
    walletId: 'wallet-personal',
    userId: '4',
    role: 'VIEWER',
    status: 'ACTIVE',
    addedAt: '2026-01-04T00:00:00.000Z',
  },
  {
    walletId: 'wallet-house',
    userId: '1',
    role: 'OWNER',
    status: 'ACTIVE',
    addedAt: '2026-01-02T00:00:00.000Z',
  },
  {
    walletId: 'wallet-house',
    userId: '3',
    role: 'EDITOR',
    status: 'ACTIVE',
    addedAt: '2026-01-03T00:00:00.000Z',
  },
  {
    walletId: 'wallet-freelancer',
    userId: '2',
    role: 'OWNER',
    status: 'ACTIVE',
    addedAt: '2026-01-03T00:00:00.000Z',
  },
]

export const { read: readWalletMembers, write: writeWalletMembers } =
  createLocalStorageCollection({
    storageKey: WALLET_MEMBERS_STORAGE_KEY,
    initialData: mockWalletMembers,
  })
